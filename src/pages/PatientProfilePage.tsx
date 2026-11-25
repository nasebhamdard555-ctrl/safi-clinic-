import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCollection } from '../lib/useCollection';
import { money } from '../lib/format';
import type { Row } from '../lib/types';
import { MODULES, type ColDef } from '../modules';
import { Button, Card, PageHeader, Stat, formatCell } from '../components/ui';

const owed = (r: Row) => /unpaid|partly/i.test(String(r.paymentStatus ?? ''));

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

export function PatientProfilePage({ patientId, back }: { patientId: string; back: () => void }) {
  const patients = useCollection('patients');
  const appts = useCollection('appointments');
  const cons = useCollection('consultations');
  const disp = useCollection('dispensing');

  const patient = patients.rows.find((p) => p.id === patientId);
  const name = String(patient?.fullName ?? '');
  const mine = (rows: Row[]) => rows.filter((r) => String(r.patientName ?? '') === name);

  const visits = useMemo(() => mine(appts.rows), [appts.rows, name]);
  const consults = useMemo(() => mine(cons.rows), [cons.rows, name]);
  const sales = useMemo(() => mine(disp.rows), [disp.rows, name]);

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

  const billed = visits.reduce((t, r) => t + Number(r.fee || 0), 0) + sales.reduce((t, r) => t + Number(r.amount || 0), 0);
  const outstanding =
    visits.filter(owed).reduce((t, r) => t + Number(r.fee || 0), 0) + sales.filter(owed).reduce((t, r) => t + Number(r.amount || 0), 0);
  const allergies = String(patient.allergies ?? '').trim();
  const hasAllergy = allergies !== '' && !/^none/i.test(allergies);

  const details: [string, unknown][] = [
    ['Phone', patient.phone],
    ['Gender', patient.gender],
    ['Date of birth', patient.dateOfBirth],
    ['Blood group', patient.bloodGroup],
    ['Notes', patient.notes],
  ];

  return (
    <div>
      <div className="mb-4">
        <Button variant="ghost" onClick={back}>
          <ArrowLeft size={16} /> Back to patients
        </Button>
      </div>
      <PageHeader title={name} subtitle="Full patient record: details, visits, consultations and purchases." />

      {hasAllergy && (
        <div className="mb-6 rounded-lg border border-danger/50 bg-danger/10 p-3 text-sm text-danger">
          <strong>Allergy alert:</strong> {allergies}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Visits" value={visits.length} />
        <Stat label="Consultations" value={consults.length} />
        <Stat label="Total billed" value={money(billed)} />
        <Stat label="Outstanding" value={money(outstanding)} hint={outstanding > 0 ? 'Unpaid or partly paid' : 'Nothing owed'} />
      </div>

      <Card className="mb-6 p-5">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-wider text-muted">{label}</dt>
              <dd className="text-sm">{value === undefined || value === null || value === '' ? '—' : String(value)}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <History title="Appointments" rows={visits} columns={MODULES.appointments.columns} />
      <History title="Consultations" rows={consults} columns={MODULES.consultations.columns} />
      <History title="Dispensing" rows={sales} columns={MODULES.dispensing.columns} />
    </div>
  );
}
