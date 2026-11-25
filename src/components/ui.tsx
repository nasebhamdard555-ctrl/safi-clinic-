import { useEffect, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { ColFormat } from '../modules';
import { dateOnly, dateTime, money } from '../lib/format';

export const inputCls =
  'w-full rounded-lg border border-line bg-ink/60 px-3 py-2 text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none';

type Variant = 'gold' | 'ghost' | 'danger';

export function Button({ variant = 'gold', className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const variants: Record<Variant, string> = {
    gold: 'bg-linear-to-b from-gold-2 to-gold text-ink hover:brightness-110',
    ghost: 'border border-line text-cream hover:border-gold hover:text-gold',
    danger: 'border border-danger/60 text-danger hover:bg-danger/10',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...rest}
    />
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-forest/80 ${className}`}>{children}</div>;
}

type Tone = 'neutral' | 'gold' | 'ok' | 'danger';
const tones: Record<Tone, string> = {
  neutral: 'border-line text-muted',
  gold: 'border-gold/50 text-gold',
  ok: 'border-ok/50 text-ok',
  danger: 'border-danger/50 text-danger',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function toneFor(text: string): Tone {
  if (/low|cancel|no show|expired|disabled|expense/i.test(text)) return /expense/i.test(text) ? 'gold' : 'danger';
  if (/complete|in stock|active|paid|checked in|income/i.test(text)) return 'ok';
  if (/sched|pending/i.test(text)) return 'gold';
  return 'neutral';
}

export function formatCell(v: unknown, f?: ColFormat): ReactNode {
  if (v === undefined || v === null || v === '') return <span className="text-muted">—</span>;
  switch (f) {
    case 'money':
      return <span className="font-medium text-gold">{money(v)}</span>;
    case 'date':
      return dateOnly(v);
    case 'datetime':
      return dateTime(v);
    case 'badge':
      return <Badge tone={toneFor(String(v))}>{String(v)}</Badge>;
    default:
      return String(v);
  }
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Clinic</p>
        <h1 className="text-2xl font-semibold text-cream">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <p className="px-4 py-10 text-center text-sm text-muted">{text}</p>;
}

export function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`my-8 w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} rounded-2xl border border-gold/40 bg-forest p-5 shadow-2xl`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gold">{title}</h2>
          <button onClick={onClose} className="text-muted hover:text-cream" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
