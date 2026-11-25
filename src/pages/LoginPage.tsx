import { useState, type FormEvent, type ReactNode } from 'react';
import { Check, Copy, KeyRound, ShieldCheck } from 'lucide-react';
import { useAuth, makeRecoveryCode } from '../lib/auth';
import { BRAND } from '../config/brand';
import { clearLocalData } from '../lib/store';
import { Button, inputCls } from '../components/ui';
import type { UserRecord } from '../lib/types';

type Mode = 'signin' | 'recovery';

export function LoginPage() {
  const { ownerExists, signIn, setupOwner, enterAfterSetup, resetWithRecoveryCode } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [tab, setTab] = useState<'staff' | 'demo'>('staff');
  const [pending, setPending] = useState<{ row: UserRecord; recoveryCode: string } | null>(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setError(null);
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const submitSetup = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      if (password !== confirm) throw new Error('The two passwords do not match.');
      setPending(await setupOwner(name, username, password));
    });
  };

  const submitSignIn = (e: FormEvent) => {
    e.preventDefault();
    run(() => signIn(username, password));
  };

  const submitRecovery = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      if (password !== confirm) throw new Error('The two passwords do not match.');
      await resetWithRecoveryCode(username, code, password);
      setMode('signin');
      setPassword('');
      setConfirm('');
      setCode('');
      setNotice('Password reset. Sign in with your new password.');
    });
  };

  const shell = (children: ReactNode) => (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden border-r border-gold/20 bg-linear-to-br from-black via-forest to-forest-2 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-gold/20" />
        <div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-b from-gold-2 to-gold text-2xl font-bold text-ink">S</div>
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-gold">{BRAND.company}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-cream">{BRAND.product}</h1>
          <p className="mt-4 max-w-md text-muted">{BRAND.tagline}</p>
        </div>
        <ul className="space-y-3 text-cream/85">
          {['Patients, appointments and consultations', 'Dispensing and stock alerts', 'Simple income and expense ledger', 'Staff and demo access, managed by the admin'].map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {t}
            </li>
          ))}
        </ul>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </div>
  );

  // Step shown once after the admin account is created.
  if (pending) {
    return shell(
      <div className="rounded-2xl border border-gold/40 bg-forest p-6 shadow-2xl">
        <ShieldCheck className="mb-3 text-gold" />
        <h2 className="text-xl font-semibold text-cream">Save your recovery code</h2>
        <p className="mb-4 mt-1 text-sm text-muted">
          If you forget your password, this code lets you set a new one. It is shown only now. Write it down or store it somewhere safe.
        </p>
        <div className="rounded-lg border border-gold/50 bg-ink/70 p-4 text-center font-mono text-xl tracking-widest text-gold">
          {pending.recoveryCode}
        </div>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(pending.recoveryCode);
              setCopied(true);
            } catch {
              window.prompt('Copy your recovery code:', pending.recoveryCode);
            }
          }}
          className="mt-3 inline-flex items-center gap-1 text-sm text-muted hover:text-gold"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy code'}
        </button>
        <div className="mt-5">
          <Button className="w-full" onClick={() => enterAfterSetup(pending.row)}>
            I've saved it, continue
          </Button>
        </div>
      </div>,
    );
  }

  // First run: create the admin account.
  if (!ownerExists) {
    return shell(
      <div className="rounded-2xl border border-gold/40 bg-forest p-6 shadow-2xl">
        <ShieldCheck className="mb-3 text-gold" />
        <h2 className="text-xl font-semibold text-cream">Create the admin account</h2>
        <p className="mb-5 mt-1 text-sm text-muted">This first account controls the system. It can create staff and demo logins.</p>
        <form onSubmit={submitSetup} className="space-y-4">
          <Field label="Your name" value={name} onChange={setName} />
          <Field label="Username" value={username} onChange={setUsername} />
          <Field label="Password (8+ characters)" value={password} onChange={setPassword} type="password" />
          <Field label="Confirm password" value={confirm} onChange={setConfirm} type="password" />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? 'Creating…' : 'Create admin account'}
          </Button>
        </form>
      </div>,
    );
  }

  // Forgot password.
  if (mode === 'recovery') {
    return shell(
      <div className="rounded-2xl border border-gold/40 bg-forest p-6 shadow-2xl">
        <KeyRound className="mb-3 text-gold" />
        <h2 className="text-xl font-semibold text-cream">Reset your admin password</h2>
        <p className="mb-5 mt-1 text-sm text-muted">Enter your username and the recovery code you saved when you created the admin account.</p>
        <form onSubmit={submitRecovery} className="space-y-4">
          <Field label="Username" value={username} onChange={setUsername} />
          <Field label="Recovery code" value={code} onChange={setCode} />
          <Field label="New password (8+ characters)" value={password} onChange={setPassword} type="password" />
          <Field label="Confirm new password" value={confirm} onChange={setConfirm} type="password" />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? 'Resetting…' : 'Set new password'}
          </Button>
          <button type="button" onClick={() => { setMode('signin'); setError(null); }} className="w-full text-sm text-muted hover:text-gold">
            Back to sign in
          </button>
        </form>
      </div>,
    );
  }

  // Sign in.
  return shell(
    <div className="rounded-2xl border border-gold/40 bg-forest p-6 shadow-2xl">
      <div className="mb-5 grid grid-cols-2 rounded-lg border border-line p-1">
        {(['staff', 'demo'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t);
              setError(null);
              setNotice(null);
            }}
            className={`rounded-md py-2 text-sm font-medium transition ${
              tab === t ? 'bg-linear-to-b from-gold-2 to-gold text-ink' : 'text-muted hover:text-cream'
            }`}
          >
            {t === 'staff' ? 'Staff & admin' : 'Demo access'}
          </button>
        ))}
      </div>
      <h2 className="text-xl font-semibold text-cream">{tab === 'staff' ? 'Sign in' : 'Open your demo'}</h2>
      <p className="mb-5 mt-1 text-sm text-muted">
        {tab === 'staff'
          ? 'Enter the username and password your admin gave you.'
          : 'Enter the demo username and password from your invitation. Demo access ends on the date it was issued for.'}
      </p>
      <form onSubmit={submitSignIn} className="space-y-4">
        <Field label="Username" value={username} onChange={setUsername} />
        <Field label="Password" value={password} onChange={setPassword} type="password" />
        {notice && <p className="text-sm text-ok">{notice}</p>}
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          <KeyRound size={16} /> {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <button
        type="button"
        onClick={() => {
          setMode('recovery');
          setError(null);
          setNotice(null);
          setPassword('');
          setConfirm('');
        }}
        className="mt-4 w-full text-sm text-muted hover:text-gold"
      >
        Forgot password?
      </button>
      <button
        type="button"
        onClick={() => {
          if (window.confirm('Delete all accounts and data saved in this browser? This cannot be undone.')) {
            clearLocalData();
            window.location.reload();
          }
        }}
        className="mt-2 w-full text-xs text-muted hover:text-danger"
      >
        Start over on this device
      </button>
    </div>,
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-muted">{label}</span>
      <input className={inputCls} type={type} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={type === 'password' ? 'current-password' : 'username'} />
    </label>
  );
}
