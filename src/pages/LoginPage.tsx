import { useState, type FormEvent } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { BRAND } from '../config/brand';
import { Button, inputCls } from '../components/ui';

export function LoginPage() {
  const { ownerExists, signIn, setupOwner } = useAuth();
  const [tab, setTab] = useState<'staff' | 'demo'>('staff');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (!ownerExists) await setupOwner(name, username, password);
      else await signIn(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden border-r border-gold/20 bg-linear-to-br from-black via-forest to-forest-2 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-gold/20" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-72 w-72 rounded-full border border-gold/10" />
        <div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-b from-gold-2 to-gold text-2xl font-bold text-ink">S</div>
          <p className="mt-6 text-sm uppercase tracking-[0.3em] text-gold">{BRAND.company}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-cream">{BRAND.product}</h1>
          <p className="mt-4 max-w-md text-muted">{BRAND.tagline}</p>
        </div>
        <ul className="space-y-3 text-cream/85">
          {['Patients, appointments and consultations', 'Dispensing and stock alerts', 'Simple income and expense ledger', 'Demo access for prospective clinics'].map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <p className="text-sm uppercase tracking-[0.3em] text-gold">{BRAND.company}</p>
            <h1 className="text-2xl font-semibold">{BRAND.product}</h1>
          </div>

          {!ownerExists ? (
            <div className="rounded-2xl border border-gold/40 bg-forest p-6 shadow-2xl">
              <ShieldCheck className="mb-3 text-gold" />
              <h2 className="text-xl font-semibold text-cream">Create the owner account</h2>
              <p className="mb-5 mt-1 text-sm text-muted">This first account controls the system and can create demo logins.</p>
              <form onSubmit={submit} className="space-y-4">
                <Field label="Your name" value={name} onChange={setName} />
                <Field label="Username" value={username} onChange={setUsername} />
                <Field label="Password (8+ characters)" value={password} onChange={setPassword} type="password" />
                {error && <p className="text-sm text-danger">{error}</p>}
                <Button type="submit" disabled={busy} className="w-full">
                  {busy ? 'Creating…' : 'Create owner account'}
                </Button>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl border border-gold/40 bg-forest p-6 shadow-2xl">
              <div className="mb-5 grid grid-cols-2 rounded-lg border border-line p-1">
                {(['staff', 'demo'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTab(t);
                      setError(null);
                    }}
                    className={`rounded-md py-2 text-sm font-medium transition ${
                      tab === t ? 'bg-linear-to-b from-gold-2 to-gold text-ink' : 'text-muted hover:text-cream'
                    }`}
                  >
                    {t === 'staff' ? 'Staff sign in' : 'Demo access'}
                  </button>
                ))}
              </div>

              <h2 className="text-xl font-semibold text-cream">{tab === 'staff' ? 'Sign in' : 'Open your demo'}</h2>
              <p className="mb-5 mt-1 text-sm text-muted">
                {tab === 'staff'
                  ? 'Enter your clinic username and password.'
                  : 'Enter the demo username and password from your Systech invitation. Demo access ends on the date it was issued for.'}
              </p>

              <form onSubmit={submit} className="space-y-4">
                <Field label="Username" value={username} onChange={setUsername} />
                <Field label="Password" value={password} onChange={setPassword} type="password" />
                {error && <p className="text-sm text-danger">{error}</p>}
                <Button type="submit" disabled={busy} className="w-full">
                  <KeyRound size={16} /> {busy ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
            </div>
          )}
          <p className="mt-6 text-center text-xs text-muted">Powered by {BRAND.company}</p>
        </div>
      </section>
    </div>
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
