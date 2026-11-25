import { useState, type FormEvent } from 'react';
import { Check, Copy, KeyRound, Power, RefreshCw, Trash2 } from 'lucide-react';
import { CollectionPage } from './CollectionPage';
import { MODULES } from '../modules';
import { store } from '../lib/store';
import { useCollection } from '../lib/useCollection';
import { hashPassword, randomSalt, randomToken } from '../lib/crypto';
import { useAuth, makeRecoveryCode } from '../lib/auth';
import { dateOnly } from '../lib/format';
import { Badge, Button, Card, EmptyState, PageHeader, inputCls } from '../components/ui';
import { BRAND } from '../config/brand';
import type { Role, UserRecord } from '../lib/types';

export function AdminPage({ section }: { section: string }) {
  if (section === 'demo') return <LoginAccessPage kind="demo" />;
  if (section === 'staff-logins') return <LoginAccessPage kind="staff" />;
  if (section === 'settings') return <SettingsPage />;
  if (section === 'account') return <AccountPage />;
  return <CollectionPage mod={MODULES.staff} />;
}

interface Issued {
  label: string;
  username: string;
  password: string;
  expires: string;
  heading: string;
}

const EXPIRY = [
  { label: '7 days', days: 7 },
  { label: '14 days', days: 14 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
  { label: 'No expiry', days: 0 },
];

function accountStatus(u: UserRecord): { label: string; tone: 'ok' | 'danger' } {
  if (!u.active) return { label: 'Disabled', tone: 'danger' };
  if (u.expiresAt && new Date(u.expiresAt).getTime() < Date.now()) return { label: 'Expired', tone: 'danger' };
  return { label: 'Active', tone: 'ok' };
}

function inviteMessage(i: Issued, link: string, kind: Role) {
  const intro =
    kind === 'demo'
      ? `Here is your demo of the ${BRAND.product} by ${BRAND.company}.`
      : `Here is your login for the ${BRAND.product} by ${BRAND.company}.`;
  const how =
    kind === 'demo'
      ? 'On the sign-in page, choose "Demo access" and enter the username and password above.'
      : 'On the sign-in page, choose "Staff & admin" and enter the username and password above.';
  return [`Hello ${i.label},`, '', intro, '', `Open: ${link}`, `Username: ${i.username}`, `Password: ${i.password}`, `Access until: ${i.expires}`, '', how].join('\n');
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          window.prompt('Copy this text:', text);
        }
      }}
      className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-xs text-cream hover:border-gold hover:text-gold"
    >
      {done ? <Check size={14} /> : <Copy size={14} />} {done ? 'Copied' : label}
    </button>
  );
}

export function LoginAccessPage({ kind }: { kind: 'demo' | 'staff' }) {
  const { rows, loading, error, reload } = useCollection('users');
  const accounts = rows.filter((r) => (r as unknown as UserRecord).role === kind) as unknown as UserRecord[];
  const isDemo = kind === 'demo';
  const [label, setLabel] = useState('');
  const [days, setDays] = useState(isDemo ? 30 : 0);
  const [link, setLink] = useState(() => window.location.origin + window.location.pathname);
  const [issued, setIssued] = useState<Issued | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const title = isDemo ? 'Demo logins' : 'Staff logins';
  const nameLabel = isDemo ? 'Customer or company name *' : 'Staff member name *';

  const generate = async (e: FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setFormError(isDemo ? 'Enter the customer or company name first.' : 'Enter the staff member name first.');
      return;
    }
    setBusy(true);
    setFormError(null);
    try {
      const username = `${kind}-${randomToken(6)}`;
      const password = randomToken(12);
      const salt = randomSalt();
      const expiresAt = days ? new Date(Date.now() + days * 86400000).toISOString() : null;
      await store.insert('users', {
        username,
        displayName: label.trim(),
        label: label.trim(),
        role: kind,
        passwordHash: await hashPassword(password, salt),
        salt,
        active: true,
        expiresAt,
      });
      setIssued({
        label: label.trim(),
        username,
        password,
        expires: expiresAt ? dateOnly(expiresAt) : 'No expiry',
        heading: `${isDemo ? 'Demo' : 'Staff'} login created`,
      });
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
      setIssued({
        label: u.label ?? u.displayName,
        username: u.username,
        password,
        expires: u.expiresAt ? dateOnly(u.expiresAt) : 'No expiry',
        heading: 'New password created',
      });
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
    if (!window.confirm(`Delete the login ${u.username}?`)) return;
    try {
      await store.remove('users', u.id);
      await reload();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not delete the account.');
    }
  };

  const invite = issued ? inviteMessage(issued, link, kind) : '';

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={
          isDemo
            ? `Create a username and password for each prospect, then send them the invitation.`
            : 'Create a username and password for each staff member. Staff can use every clinic module.'
        }
      />

      {store.mode === 'local' && (
        <p className="mb-6 rounded-lg border border-gold/40 bg-gold/10 p-4 text-sm text-gold">
          Logins are saved only in this browser right now, so people can't sign in from their own devices yet. Connect the
          shared database (Supabase) to send logins to anyone.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-2">
          <h2 className="mb-4 font-semibold text-gold">{isDemo ? 'Create a demo login' : 'Create a staff login'}</h2>
          <form onSubmit={generate} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-muted">{nameLabel}</span>
              <input
                className={inputCls}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={isDemo ? 'e.g. Noor Medical Centre' : 'e.g. Dr. Sample Doctor'}
              />
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
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-muted">Link to share</span>
              <input className={inputCls} value={link} onChange={(e) => setLink(e.target.value)} />
            </label>
            {formError && <p className="text-sm text-danger">{formError}</p>}
            <Button type="submit" disabled={busy} className="w-full">
              <KeyRound size={16} /> {busy ? 'Creating…' : 'Generate username and password'}
            </Button>
          </form>

          {issued && (
            <div className="mt-5 rounded-xl border border-gold/50 bg-ink/70 p-4">
              <p className="text-sm font-semibold text-gold">{issued.heading}</p>
              <p className="mt-1 text-xs text-muted">
                For {issued.label}. The password is shown only now, so copy it or send the invitation before you leave this page.
              </p>
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
                <div className="flex flex-wrap gap-2 pt-1">
                  <CopyButton text={invite} label="Copy invitation" />
                  <a
                    href={`mailto:?subject=${encodeURIComponent(`Your ${BRAND.product} login`)}&body=${encodeURIComponent(invite)}`}
                    className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-xs text-cream hover:border-gold hover:text-gold"
                  >
                    Email invitation
                  </a>
                </div>
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
                  <th className="px-4 py-3 font-medium">{isDemo ? 'Customer' : 'Staff member'}</th>
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
                      <EmptyState text={`No ${isDemo ? 'demo' : 'staff'} logins yet. Create one on the left.`} />
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

export function AccountPage() {
  const { user, refreshUser } = useAuth();
  const [current, setCurrent] = useState('');
  const [username, setUsername] = useState(user?.username ?? '');
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [newCode, setNewCode] = useState<string | null>(null);

  if (!user) return null;

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const fail = (text: string) => setMessage({ ok: false, text });
    if (!username.trim()) return fail('Enter a username.');
    if (!displayName.trim()) return fail('Enter your name.');
    if ((await hashPassword(current, user.salt)) !== user.passwordHash) return fail('Your current password is wrong.');
    const changingPassword = next.length > 0 || confirm.length > 0;
    if (changingPassword && next.length < 8) return fail('The new password needs at least 8 characters.');
    if (changingPassword && next !== confirm) return fail('The new passwords do not match.');

    setBusy(true);
    try {
      const taken = (await store.list('users')).some(
        (u) => u.id !== user.id && String(u.username).toLowerCase() === username.trim().toLowerCase(),
      );
      if (taken) throw new Error('That username is already used by another account.');
      const patch: Record<string, unknown> = { username: username.trim(), displayName: displayName.trim() };
      if (changingPassword) {
        const salt = randomSalt();
        patch.salt = salt;
        patch.passwordHash = await hashPassword(next, salt);
      }
      await store.update('users', user.id, patch);
      await refreshUser();
      setCurrent('');
      setNext('');
      setConfirm('');
      setMessage({ ok: true, text: changingPassword ? 'Account and password updated.' : 'Account updated.' });
    } catch (err) {
      fail(err instanceof Error ? err.message : 'Could not save your account.');
    } finally {
      setBusy(false);
    }
  };

  const regenerateCode = async () => {
    if ((await hashPassword(current, user.salt)) !== user.passwordHash) {
      setMessage({ ok: false, text: 'Enter your current password above to get a new recovery code.' });
      return;
    }
    if (!window.confirm('Create a new recovery code? The old code will stop working.')) return;
    const code = makeRecoveryCode();
    const recoverySalt = randomSalt();
    try {
      await store.update('users', user.id, {
        recoverySalt,
        recoveryHash: await hashPassword(code.replace(/-/g, '').toLowerCase(), recoverySalt),
      });
      setNewCode(code);
      setCurrent('');
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : 'Could not create a recovery code.' });
    }
  };

  return (
    <div>
      <PageHeader title="My account" subtitle="Change your username, name or password. Enter your current password to save." />
      <div className="grid max-w-3xl gap-6">
        <Card className="p-5">
          <form onSubmit={save} className="grid gap-4">
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-muted">Your name</span>
              <input name="displayName" className={inputCls} value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-muted">Username</span>
              <input name="username" className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
            </label>
            <hr className="border-line" />
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-muted">Current password *</span>
              <input name="current" type="password" className={inputCls} value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-muted">New password (leave blank to keep it)</span>
              <input name="next" type="password" className={inputCls} value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-muted">Confirm new password</span>
              <input name="confirm" type="password" className={inputCls} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
            </label>
            {message && <p className={`text-sm ${message.ok ? 'text-ok' : 'text-danger'}`}>{message.text}</p>}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</Button>
              <Button type="button" variant="ghost" onClick={regenerateCode}>
                <RefreshCw size={14} /> New recovery code
              </Button>
            </div>
          </form>
        </Card>

        {newCode && (
          <Card className="border-gold/50 p-5">
            <p className="text-sm font-semibold text-gold">Your new recovery code</p>
            <p className="mb-3 mt-1 text-xs text-muted">Shown only now. Write it down or store it somewhere safe.</p>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gold/50 bg-ink/70 p-4">
              <span className="font-mono text-lg tracking-widest text-gold">{newCode}</span>
              <CopyButton text={newCode} />
            </div>
          </Card>
        )}
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
