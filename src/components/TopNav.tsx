import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { BRAND } from '../config/brand';

interface NavItem {
  page: string;
  label: string;
}

interface NavGroup {
  id: string;
  label: string;
  page?: string;
  items?: NavItem[];
  ownerOnly?: boolean;
}

export const NAV: NavGroup[] = [
  { id: 'overview', label: 'Overview', page: 'overview' },
  {
    id: 'reception',
    label: 'Reception',
    items: [
      { page: 'patients', label: 'Patients' },
      { page: 'appointments', label: 'Appointments' },
    ],
  },
  { id: 'clinical', label: 'Clinical', items: [{ page: 'consultations', label: 'Consultations' }] },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    items: [
      { page: 'dispensing', label: 'Dispensing' },
      { page: 'inventory', label: 'Inventory' },
    ],
  },
  { id: 'finance', label: 'Finance', items: [{ page: 'accounting', label: 'Income & expenses' }] },
  {
    id: 'admin',
    label: 'Admin',
    ownerOnly: true,
    items: [
      { page: 'admin:account', label: 'My account' },
      { page: 'admin:staff', label: 'Staff directory' },
      { page: 'admin:staff-logins', label: 'Staff logins' },
      { page: 'admin:demo', label: 'Demo logins' },
      { page: 'admin:settings', label: 'Clinic settings' },
    ],
  },
];

interface TopNavProps {
  page: string;
  go: (page: string) => void;
  isOwner: boolean;
  userName: string;
  onSignOut: () => void;
}

export function TopNav({ page, go, isOwner, userName, onSignOut }: TopNavProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenId(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const choose = (p: string) => {
    setOpenId(null);
    go(p);
  };

  return (
    <header ref={ref} className="sticky top-0 z-40 border-b border-gold/30 bg-black/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
        <button onClick={() => choose('overview')} className="flex shrink-0 items-center gap-3 pr-2 text-left">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-linear-to-b from-gold-2 to-gold font-bold text-ink">S</span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold text-gold">{BRAND.company}</span>
            <span className="block text-[11px] text-muted">{BRAND.product}</span>
          </span>
        </button>

        <nav className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          {NAV.filter((g) => isOwner || !g.ownerOnly).map((g) => {
            const active = g.page ? page === g.page : g.items?.some((i) => i.page === page);
            const base = `inline-flex shrink-0 items-center gap-1 rounded-md px-3 py-2 text-sm transition ${
              active ? 'bg-gold/15 text-gold' : 'text-cream/80 hover:bg-gold/10 hover:text-gold'
            }`;
            if (g.page) {
              return (
                <button key={g.id} className={base} onClick={() => choose(g.page!)}>
                  {g.label}
                </button>
              );
            }
            const isOpen = openId === g.id;
            return (
              <div key={g.id} className="relative">
                <button className={base} onClick={() => setOpenId(isOpen ? null : g.id)} aria-expanded={isOpen}>
                  {g.label}
                  <ChevronDown size={14} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="absolute left-0 top-full z-50 mt-1 min-w-52 overflow-hidden rounded-lg border border-gold/40 bg-forest shadow-2xl">
                    {g.items?.map((i) => (
                      <button
                        key={i.page}
                        onClick={() => choose(i.page)}
                        className={`block w-full px-4 py-2.5 text-left text-sm transition ${
                          page === i.page ? 'bg-gold/15 text-gold' : 'text-cream/85 hover:bg-gold/10 hover:text-gold'
                        }`}
                      >
                        {i.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <span className="hidden text-right text-xs md:block">
            <span className="block text-cream">{userName}</span>
            <span className="block text-muted">{isOwner ? 'Owner' : 'Demo / staff'}</span>
          </span>
          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-1 rounded-md border border-line px-3 py-2 text-sm text-cream hover:border-gold hover:text-gold"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
