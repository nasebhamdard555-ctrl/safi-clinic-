import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, Check, Loader2, Printer } from 'lucide-react';
import { useCollection } from '../lib/useCollection';
import { useAuth } from '../lib/auth';
import { store } from '../lib/store';
import { logActivity } from '../lib/activity';
import { money } from '../lib/format';
import { buildPatientFinancialSummary } from '../lib/patientReceipt';
import {
  createDebouncedAutoSaver,
  extractPatientForm,
  getPatientFormDiff,
  validatePatientForm,
  type AutoSaver,
  type PatientFormValues,
} from '../lib/patientAutoSave';
import type { Row } from '../lib/types';
import { MODULES, type ColDef, type FieldDef } from '../modules';
import { PatientReceiptModal } from '../components/Receipt';
import { Button, Card, PageHeader, Stat, formatCell, inputCls } from '../components/ui';

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

function History({ title, rows, columns }: { title: string; rows: Row[]; columns: ColDef[] }) {
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="border-b border-line px-4 py-3 text-sm font-semibold text-gold">
        {title} <span className="text-muted">({rows.length})</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-muted">Nothing recorded yet.</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-line/60">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-2.5 align-top">
                    {formatCell(r[c.key], c.format)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ProfileField({
  def,
  value,
  onChange,
  onBlur,
}: {
  def: FieldDef;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  return (
    <label className={`block ${def.type === 'textarea' ? 'sm:col-span-2 lg:col-span-3' : ''}`}>
      <span className="mb-1 block text-xs uppercase tracking-wider text-muted">
        {def.label}
        {def.required && <span className="text-gold"> *</span>}
      </span>
      {def.type === 'select' ? (
        <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur}>
          {!value && <option value="" />}
          {def.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : def.type === 'textarea' ? (
        <textarea
          rows={2}
          className={inputCls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      ) : (
        <input
          type={def.type ?? 'text'}
          className={inputCls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      )}
    </label>
  );
}

export function PatientProfilePage({ patientId, back }: { patientId: string; back: () => void }) {
  const { user } = useAuth();
  const patients = useCollection('patients');
  const appts = useCollection('appointments');
  const cons = useCollection('consultations');
  const disp = useCollection('dispensing');
  const [showReceipt, setShowReceipt] = useState(false);

  const patient = patients.rows.find((p) => p.id === patientId);
  const fields = MODULES.patients.fields;

  const [form, setForm] = useState<PatientFormValues>({});
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const loadedIdRef = useRef<string | null>(null);
  const savedFormRef = useRef<PatientFormValues>({});
  const currentFormRef = useRef<PatientFormValues>({});
  const savingRef = useRef(false);
  const pendingResaveRef = useRef(false);
  const autoSaverRef = useRef<AutoSaver | null>(null);

  // Sync local editable form once per loaded patient record without clobbering active typing.
  useEffect(() => {
    if (!patient) return;
    if (loadedIdRef.current !== patient.id) {
      const initial = extractPatientForm(patient, fields);
      loadedIdRef.current = patient.id;
      savedFormRef.current = initial;
      currentFormRef.current = initial;
      setForm(initial);
      setSaveState('idle');
      setSaveError(null);
      setSavedAt(null);
    }
  }, [patient, fields]);

  const persistChanges = useCallback(async () => {
    const id = loadedIdRef.current;
    if (!id) return;

    const snapshot = { ...currentFormRef.current };
    const validationError = validatePatientForm(snapshot, fields);
    if (validationError) {
      setSaveError(validationError);
      setSaveState('error');
      return;
    }

    const { patch, changedLabels } = getPatientFormDiff(savedFormRef.current, snapshot, fields);
    if (changedLabels.length === 0) {
      setSaveError(null);
      return;
    }

    if (savingRef.current) {
      pendingResaveRef.current = true;
      return;
    }

    savingRef.current = true;
    setSaveState('saving');
    setSaveError(null);
    try {
      await store.update('patients', id, patch);
      savedFormRef.current = { ...savedFormRef.current, ...patch };
      const labelName = String(savedFormRef.current.fullName || 'Patient');
      await logActivity(
        user?.displayName ?? 'Unknown',
        'Updated',
        'patient',
        `${labelName} (${changedLabels.join(', ')})`,
      );
      await patients.reload();
      setSavedAt(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      const remaining = getPatientFormDiff(savedFormRef.current, currentFormRef.current, fields);
      setSaveState(remaining.changedLabels.length > 0 ? 'dirty' : 'saved');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Auto-save failed.');
      setSaveState('error');
    } finally {
      savingRef.current = false;
      if (pendingResaveRef.current) {
        pendingResaveRef.current = false;
        void persistChanges();
      }
    }
  }, [fields, patients, user?.displayName]);

  const persistRef = useRef(persistChanges);
  persistRef.current = persistChanges;

  useEffect(() => {
    const saver = createDebouncedAutoSaver(() => persistRef.current(), { debounceMs: 800, maxWaitMs: 3000 });
    autoSaverRef.current = saver;
    return () => {
      void saver.flush();
      autoSaverRef.current = null;
    };
  }, []);

  const updateField = (key: string, value: string) => {
    const next = { ...currentFormRef.current, [key]: value };
    currentFormRef.current = next;
    setForm(next);

    const validationError = validatePatientForm(next, fields);
    if (validationError) {
      setSaveError(validationError);
      setSaveState('error');
      autoSaverRef.current?.cancel();
      return;
    }

    const { changedLabels } = getPatientFormDiff(savedFormRef.current, next, fields);
    if (changedLabels.length === 0) {
      setSaveError(null);
      setSaveState(savedAt ? 'saved' : 'idle');
      autoSaverRef.current?.cancel();
      return;
    }

    setSaveError(null);
    setSaveState('dirty');
    autoSaverRef.current?.schedule();
  };

  const handleFieldBlur = () => {
    const { changedLabels } = getPatientFormDiff(savedFormRef.current, currentFormRef.current, fields);
    if (changedLabels.length > 0) {
      void autoSaverRef.current?.flush();
    }
  };

  const handleBack = async () => {
    await autoSaverRef.current?.flush();
    back();
  };

  const savedName = String(patient?.fullName ?? '');
  const displayName = String(form.fullName || savedName);
  const mine = useCallback(
    (rows: Row[]) => rows.filter((r) => String(r.patientName ?? '') === savedName),
    [savedName],
  );

  const visits = useMemo(() => mine(appts.rows), [appts.rows, mine]);
  const consults = useMemo(() => mine(cons.rows), [cons.rows, mine]);
  const sales = useMemo(() => mine(disp.rows), [disp.rows, mine]);

  if (patients.loading) return <p className="text-muted">Loading…</p>;
  if (!patient) {
    return (
      <div>
        <PageHeader title="Patient not found" subtitle="This record may have been deleted." />
        <Button variant="ghost" onClick={back}>
          <ArrowLeft size={16} /> Back to patients
        </Button>
      </div>
    );
  }

  const livePatient: Row = { ...patient, ...form };
  const summary = buildPatientFinancialSummary(livePatient, visits, consults, sales);
  const allergies = String(livePatient.allergies ?? '').trim();
  const hasAllergy = allergies !== '' && !/^none/i.test(allergies);

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft size={16} /> Back to patients
        </Button>
      </div>
      <PageHeader
        title={displayName}
        subtitle="Full patient record: details auto-save as you edit, alongside visits, consultations and purchases."
        actions={
          <Button onClick={() => setShowReceipt(true)}>
            <Printer size={16} /> Print Receipt
          </Button>
        }
      />

      {hasAllergy && (
        <div className="mb-6 rounded-lg border border-danger/50 bg-danger/10 p-3 text-sm text-danger">
          <strong>Allergy alert:</strong> {allergies}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Visits" value={summary.visitCount} />
        <Stat label="Consultations" value={summary.consultationCount} />
        <Stat label="Total billed" value={money(summary.totalBilled)} />
        <Stat
          label="Outstanding"
          value={money(summary.outstanding)}
          hint={summary.outstanding > 0 ? 'Unpaid or partly paid' : 'Nothing owed'}
        />
      </div>

      <Card className="mb-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
          <h2 className="text-sm font-semibold text-gold">Patient details</h2>
          <div className="flex items-center gap-1.5 text-xs" role="status" aria-live="polite">
            {saveState === 'saving' && (
              <span className="inline-flex items-center gap-1.5 text-gold">
                <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                Auto-saving…
              </span>
            )}
            {saveState === 'dirty' && (
              <span className="text-muted">Unsaved changes · auto-saving shortly…</span>
            )}
            {saveState === 'saved' && (
              <span className="inline-flex items-center gap-1 text-ok">
                <Check size={13} aria-hidden="true" />
                Auto-saved{savedAt ? ` at ${savedAt}` : ''}
              </span>
            )}
            {saveState === 'error' && (
              <span className="inline-flex items-center gap-1 text-danger">
                <AlertCircle size={13} aria-hidden="true" />
                {saveError ?? 'Could not auto-save'}
              </span>
            )}
            {saveState === 'idle' && <span className="text-muted">Changes auto-save automatically</span>}
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void autoSaverRef.current?.flush();
          }}
          className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {fields.map((def) => (
            <ProfileField
              key={def.key}
              def={def}
              value={form[def.key] ?? ''}
              onChange={(v) => updateField(def.key, v)}
              onBlur={handleFieldBlur}
            />
          ))}
        </form>
      </Card>

      <History title="Appointments" rows={visits} columns={MODULES.appointments.columns} />
      <History title="Consultations" rows={consults} columns={MODULES.consultations.columns} />
      <History title="Dispensing" rows={sales} columns={MODULES.dispensing.columns} />

      {showReceipt && <PatientReceiptModal summary={summary} patient={livePatient} onClose={() => setShowReceipt(false)} />}
    </div>
  );
}
