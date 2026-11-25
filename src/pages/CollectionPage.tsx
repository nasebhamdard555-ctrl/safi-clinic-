import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Download, Pencil, Plus, Receipt, Search, Trash2, UserRound } from 'lucide-react';
import { store } from '../lib/store';
import { useCollection } from '../lib/useCollection';
import { useAuth } from '../lib/auth';
import { logActivity } from '../lib/activity';
import { downloadCsv } from '../lib/csv';
import { nowLocal, today } from '../lib/format';
import type { Row } from '../lib/types';
import type { FieldDef, ModuleDef } from '../modules';
import { ReceiptModal } from '../components/Receipt';
import { Button, Card, EmptyState, Modal, PageHeader, formatCell, inputCls } from '../components/ui';

function Field({ def, value, names, onChange }: { def: FieldDef; value: string; names: string[]; onChange: (v: string) => void }) {
  let control: ReactNode;
  if (def.type === 'select') {
    control = (
      <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
        {!value && <option value="" />}
        {def.options?.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    );
  } else if (def.type === 'patient') {
    control = (
      <>
        <input
          list="patient-names"
          className={inputCls}
          value={value}
          placeholder="Type a name or pick a registered patient"
          onChange={(e) => onChange(e.target.value)}
        />
        <datalist id="patient-names">
          {names.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
      </>
    );
  } else if (def.type === 'textarea') {
    control = <textarea rows={3} className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />;
  } else {
    control = (
      <input
        className={inputCls}
        type={def.type ?? 'text'}
        step={def.type === 'number' ? 'any' : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <label className={`block ${def.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1 block text-xs uppercase tracking-wider text-muted">
        {def.label}
        {def.required && <span className="text-gold"> *</span>}
      </span>
      {control}
    </label>
  );
}

interface SortState {
  key: string;
  dir: 1 | -1;
}

export function CollectionPage({
  mod,
  header,
  rowFilter,
  onOpenPatient,
}: {
  mod: ModuleDef;
  header?: ReactNode;
  rowFilter?: (row: Row) => boolean;
  onOpenPatient?: (row: Row) => void;
}) {
  const { rows, loading, error, reload } = useCollection(mod.collection);
  const { rows: patientRows } = useCollection('patients');
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortState | null>(null);
  const [editing, setEditing] = useState<Row | 'new' | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [receiptRow, setReceiptRow] = useState<Row | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const names = useMemo(
    () => patientRows.map((p) => String(p.fullName ?? '')).filter(Boolean).sort(),
    [patientRows],
  );

  const decorated = useMemo(() => {
    const scoped = rowFilter ? rows.filter(rowFilter) : rows;
    return mod.decorate ? scoped.map(mod.decorate) : scoped;
  }, [rows, mod, rowFilter]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return decorated;
    return decorated.filter((r) => mod.searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)));
  }, [decorated, query, mod]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const out = [...filtered];
    out.sort((a, b) => {
      const x = a[sort.key];
      const y = b[sort.key];
      const nx = Number(x);
      const ny = Number(y);
      if (x !== '' && y !== '' && x != null && y != null && !Number.isNaN(nx) && !Number.isNaN(ny)) {
        return (nx - ny) * sort.dir;
      }
      return String(x ?? '').localeCompare(String(y ?? '')) * sort.dir;
    });
    return out;
  }, [filtered, sort]);

  const toggleSort = (key: string) =>
    setSort((s) => (s && s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }));

  const openNew = () => {
    const init: Record<string, string> = {};
    mod.fields.forEach((f) => {
      init[f.key] = f.options
        ? f.options[0]
        : f.type === 'date'
          ? today()
          : f.type === 'datetime-local'
            ? nowLocal()
            : '';
    });
    setForm(init);
    setFormError(null);
    setEditing('new');
  };

  const openEdit = (row: Row) => {
    const init: Record<string, string> = {};
    mod.fields.forEach((f) => {
      init[f.key] = row[f.key] == null ? '' : String(row[f.key]);
    });
    setForm(init);
    setFormError(null);
    setEditing(row);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const missing = mod.fields.find((f) => f.required && !form[f.key]?.trim());
    if (missing) {
      setFormError(`${missing.label} is required.`);
      return;
    }
    const data: Record<string, unknown> = {};
    mod.fields.forEach((f) => {
      const v = form[f.key] ?? '';
      data[f.key] = f.type === 'number' ? Number(v || 0) : v;
    });
    setBusy(true);
    try {
      const label = String(data[mod.columns[0].key] || mod.singular);
      if (editing === 'new') {
        await store.insert(mod.collection, data);
        await logActivity(user?.displayName ?? 'Unknown', 'Added', mod.singular, label);
        setToast(`${mod.singular[0].toUpperCase()}${mod.singular.slice(1)} added.`);
      } else if (editing) {
        await store.update(mod.collection, editing.id, data);
        await logActivity(user?.displayName ?? 'Unknown', 'Updated', mod.singular, label);
        setToast(`${mod.singular[0].toUpperCase()}${mod.singular.slice(1)} updated.`);
      }
      setEditing(null);
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row: Row) => {
    if (!window.confirm(`Delete this ${mod.singular}?`)) return;
    try {
      await store.remove(mod.collection, row.id);
      await logActivity(user?.displayName ?? 'Unknown', 'Deleted', mod.singular, String(row[mod.columns[0].key] ?? mod.singular));
      setToast(`${mod.singular[0].toUpperCase()}${mod.singular.slice(1)} deleted.`);
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete.');
    }
  };

  const exportCsv = () => {
    downloadCsv(
      `${mod.collection}-${today()}.csv`,
      mod.columns.map((c) => c.label),
      sorted.map((r) => mod.columns.map((c) => r[c.key] ?? '')),
    );
  };

  return (
    <div>
      <PageHeader
        title={mod.title}
        subtitle={mod.subtitle}
        actions={
          <>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${mod.title.toLowerCase()}`}
                className={`${inputCls} pl-9 sm:w-64`}
              />
            </div>
            <Button variant="ghost" onClick={exportCsv} disabled={sorted.length === 0}>
              <Download size={16} /> Export CSV
            </Button>
            <Button onClick={openNew}>
              <Plus size={16} /> Add {mod.singular}
            </Button>
          </>
        }
      />
      {header}
      {error && <p className="mb-4 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm text-danger">{error}</p>}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-ink/40 text-xs uppercase tracking-wider text-muted">
              <tr>
                {mod.columns.map((c) => (
                  <th key={c.key} className="whitespace-nowrap px-4 py-3 font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-gold"
                    >
                      {c.label}
                      {sort?.key === c.key ? (
                        sort.dir === 1 ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                      ) : (
                        <ArrowUpDown size={12} className="opacity-40" />
                      )}
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={mod.columns.length + 1} className="px-4 py-6 text-muted">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && sorted.length === 0 && (
                <tr>
                  <td colSpan={mod.columns.length + 1}>
                    <EmptyState
                      text={query ? 'No matches found.' : `No ${mod.title.toLowerCase()} yet. Click “Add ${mod.singular}” to start.`}
                    />
                  </td>
                </tr>
              )}
              {sorted.map((row) => (
                <tr key={row.id} className="border-b border-line/60 hover:bg-gold/5">
                  {mod.columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 align-top">
                      {formatCell(row[c.key], c.format)}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {onOpenPatient && (
                      <button onClick={() => onOpenPatient(row)} className="mr-3 inline-flex items-center gap-1 text-muted hover:text-gold">
                        <UserRound size={14} /> Profile
                      </button>
                    )}
                    {mod.receiptAmountKey && (
                      <button onClick={() => setReceiptRow(row)} className="mr-3 inline-flex items-center gap-1 text-muted hover:text-gold">
                        <Receipt size={14} /> Receipt
                      </button>
                    )}
                    <button onClick={() => openEdit(row)} className="mr-3 inline-flex items-center gap-1 text-muted hover:text-gold">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => remove(row)} className="inline-flex items-center gap-1 text-muted hover:text-danger">
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-line px-4 py-2 text-xs text-muted">
          {sorted.length} of {rows.length} records
        </div>
      </Card>

      {editing && (
        <Modal title={`${editing === 'new' ? 'Add' : 'Edit'} ${mod.singular}`} onClose={() => setEditing(null)} wide>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            {mod.fields.map((f) => (
              <Field key={f.key} def={f} names={names} value={form[f.key] ?? ''} onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))} />
            ))}
            {formError && <p className="text-sm text-danger sm:col-span-2">{formError}</p>}
            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {receiptRow && <ReceiptModal mod={mod} row={receiptRow} onClose={() => setReceiptRow(null)} />}

      {toast && (
        <div role="status" className="fixed bottom-5 right-5 z-50 rounded-lg border border-gold/50 bg-forest px-4 py-3 text-sm text-gold shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
