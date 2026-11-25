import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { store } from '../lib/store';
import { useCollection } from '../lib/useCollection';
import { nowLocal, today } from '../lib/format';
import type { Row } from '../lib/types';
import type { FieldDef, ModuleDef } from '../modules';
import { Button, Card, EmptyState, Modal, PageHeader, formatCell, inputCls } from '../components/ui';

function Field({ def, value, onChange }: { def: FieldDef; value: string; onChange: (v: string) => void }) {
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

export function CollectionPage({ mod, header }: { mod: ModuleDef; header?: ReactNode }) {
  const { rows, loading, error, reload } = useCollection(mod.collection);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Row | 'new' | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const decorated = useMemo(() => (mod.decorate ? rows.map(mod.decorate) : rows), [rows, mod]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return decorated;
    return decorated.filter((r) => mod.searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q)));
  }, [decorated, query, mod]);

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
      if (editing === 'new') await store.insert(mod.collection, data);
      else if (editing) await store.update(mod.collection, editing.id, data);
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
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete.');
    }
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
                    {c.label}
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
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={mod.columns.length + 1}>
                    <EmptyState
                      text={query ? 'No matches found.' : `No ${mod.title.toLowerCase()} yet. Click “Add ${mod.singular}” to start.`}
                    />
                  </td>
                </tr>
              )}
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-line/60 hover:bg-gold/5">
                  {mod.columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 align-top">
                      {formatCell(row[c.key], c.format)}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
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
          {filtered.length} of {rows.length} records
        </div>
      </Card>

      {editing && (
        <Modal title={`${editing === 'new' ? 'Add' : 'Edit'} ${mod.singular}`} onClose={() => setEditing(null)} wide>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            {mod.fields.map((f) => (
              <Field key={f.key} def={f} value={form[f.key] ?? ''} onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))} />
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
    </div>
  );
}
