import { useState, type FormEvent } from 'react';
import { Check, Copy, KeyRound, Power, Trash2 } from 'lucide-react';
import { CollectionPage } from './CollectionPage';
import { MODULES } from '../modules';
import { store } from '../lib/store';
import { useCollection } from '../lib/useCollection';
import { hashPassword, randomSalt, randomToken } from '../lib/crypto';
import { dateOnly } from '../lib/format';
import { Badge, Button, Card, EmptyState, PageHeader, inputCls } from '../components/ui';
import { BRAND } from '../config/brand';
import type { UserRecord } from '../lib/types';

export function AdminPage({ section }: { section: string }) {
  if (section === 'demo') return <DemoAccessPage />;
  if (section === 'settings') return <SettingsPage />;
  return <CollectionPage mod={MODULES.staff} />;
}

interface Issued {
  label: string;
  username: string;
  password: string;
  heading: string;
}

const EXPIRY = [
  { label: '7 days', days: 7 },
  { label: '14 days', days: 14 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
  { label: 'No expiry', days: 0 },
];

function accountStatus(u: UserRecord): { label: string; tone: 'ok' | 'danger' | 'gold' } {
  if (!u.active) return { label: 'Disabled', tone: 'danger' };
  if (u.expiresAt && new Date(u.expiresAt).getTime() < Date.now()) return { label: 'Expired', tone: 'danger' };
  return { label: 'Active', tone: 'ok' };
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (await copyText(text)) {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }
      }}
      className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-xs text-cream hover:border-gold hover:text-gold"
    >
      {done ? <Check size={14} /> : <Copy size={14} />} {done ? 'Copied' : 'Copy'}
    </button>
  );
}

export function DemoAccessPage() {
  const { rows, loading, error, reload } = useCollection('users');
  const accounts = rows.filter((r) => (r as unknown as UserRecord).role !== 'owner') as unknown as UserRecord[];
  const [label, setLabel] = useState('');
  const [days, setDays] = useState(30);
  const [issued, setIssued] = useState<Issued | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const generate = async (e: FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setFormError('Enter the customer or company name first.');
      return;
    }
    setBusy(true);
    setFormError(null);
    try {
      const username = `demo-${randomToken(6)}`;
      const password = randomToken(12);
      const salt = randomSalt();
      await store.insert('users', {
        username,
        displayName: label.trim(),
        label: label.trim(),
        role: 'demo',
        passwordHash: await hashPassword(password, salt),
        salt,
        active: true,
        expiresAt: days ? new Date(Date.now() + days * 86400000).toISOString() : null,
      });
      setIssued({ label: label.trim(), username, password, heading: 'Demo login created' });
      setLabel('');
      await reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not create the login.');
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async (u: UserRecord) => {
    if (!window.confirm(`Create a new password for ${u.username}? The old one will stop working.`)) return;
    const password = randomToken(12);
    const salt = randomSalt();
    try {
      await store.update('users', u.id, { salt, passwordHash: await hashPassword(password, salt) });
      setIssued({ label: u.label ?? u.displayName, username: u.username, password, heading: 'New password created' });
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not reset the password.');
    }
  };

  const toggle = async (u: UserRecord) => {
    try {
      await store.update('users', u.id, { active: !u.active });
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not update the account.');
    }
  };

  const remove = async (u: UserRecord) => {
    if (!window.confirm(`Delete the demo login ${u.username}?`)) return;
    try {
      await store.remove('users', u.id);
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete the account.');
    }
  };

  return (
    <div>
      <PageHeader title="Demo logins" subtitle={`Create a username and password for each prospect, so they can explore the ${BRAND.product} for a set time.`} />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 font-semibold text-gold">Create a demo login</h2>
          <form onSubmit={generate} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-muted">Customer or company name *</span>
              <input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Noor Medical Centre" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-muted">Access length</span>
              <select className={inputCls} value={days} onChange={(e) => setDays(Number(e.target.value))}>
                {EXPIRY.map((x) => (
                  <option key={x.label} value={x.days}>
                    {x.label}
                  </option>
                ))}
              </select>
            </label>
            {formError && <p className="text-sm text-danger">{formError}</p>}
            <Button type="submit" disabled={busy} className="w-full">
              <KeyRound size={16} /> {busy ? 'Creating…' : 'Generate username and password'}
            </Button>
          </form>

          {issued && (
            <div className="mt-5 rounded-xl border border-gold/50 bg-ink/70 p-4">
              <p className="text-sm font-semibold text-gold">{issued.heading}</p>
              <p className="mt-1 text-xs text-muted">For {issued.label}. Copy these now. The password cannot be shown again.</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2">
                  <span>
                    <span className="text-muted">Username </span>
                    <span className="font-mono text-cream">{issued.username}</span>
                  </span>
                  <CopyButton text={issued.username} />
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2">
                  <span>
                    <span className="text-muted">Password </span>
                    <span className="font-mono text-cream">{issued.password}</span>
                  </span>
                  <CopyButton text={issued.password} />
                </div>
                <CopyButton text={`Username: ${issued.username}\nPassword: ${issued.password}`} />
              </div>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden lg:col-span-3">
          <div className="border-b border-line px-4 py-3">
            <h2 className="font-semibold text-gold">Issued logins</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-ink/40 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Expires</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-muted">
                      Loading…
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-danger">
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && accounts.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState text="No demo logins yet. Create one on the left." />
                    </td>
                  </tr>
                )}
                {accounts.map((u) => {
                  const s = accountStatus(u);
                  return (
                    <tr key={u.id} className="border-b border-line/60 hover:bg-gold/5">
                      <td className="px-4 py-3 text-cream">{u.label ?? u.displayName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted">{u.username}</td>
                      <td className="px-4 py-3">
                        <Badge tone={s.tone}>{s.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted">{u.expiresAt ? dateOnly(u.expiresAt) : 'No expiry'}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button onClick={() => resetPassword(u)} className="mr-3 text-muted hover:text-gold">
                          Reset password
                        </button>
                        <button onClick={() => toggle(u)} className="mr-3 inline-flex items-center gap-1 text-muted hover:text-gold">
                          <Power size={14} /> {u.active ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => remove(u)} className="inline-flex items-center gap-1 text-muted hover:text-danger">
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

const CLINIC_FIELDS = [
  { key: 'name', label: 'Clinic name' },
  { key: 'address', label: 'Address' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'hours', label: 'Opening hours' },
];

export function SettingsPage() {
  const { rows, loading, reload } = useCollection('settings');
  const saved = rows.find((r) => r.id === 'clinic');
  const [form, setForm] = useState<Record<string, string> | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const current = form ?? Object.fromEntries(CLINIC_FIELDS.map((f) => [f.key, String(saved?.[f.key] ?? '')]));

  const save = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await store.put('settings', 'clinic', current);
      setMessage('Clinic settings saved.');
      setForm(null);
      await reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not save settings.');
    }
  };

  return (
    <div>
      <PageHeader title="Clinic settings" subtitle="These details appear on printed receipts and the clinic profile." />
      <Card className="max-w-2xl p-5">
        {loading ? (
          <p className="text-muted">Loading…</p>
        ) : (
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            {CLINIC_FIELDS.map((f) => (
              <label key={f.key} className={`block ${f.key === 'address' ? 'sm:col-span-2' : ''}`}>
                <span className="mb-1 block text-xs uppercase tracking-wider text-muted">{f.label}</span>
                <input className={inputCls} value={current[f.key] ?? ''} onChange={(e) => setForm({ ...current, [f.key]: e.target.value })} />
              </label>
            ))}
            {message && <p className="text-sm text-gold sm:col-span-2">{message}</p>}
            <div className="sm:col-span-2">
              <Button type="submit">Save settings</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
