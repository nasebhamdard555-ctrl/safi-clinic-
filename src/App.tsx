import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './lib/auth';
import type { Row } from './lib/types';
import { TopNav } from './components/TopNav';
import { ShortcutsModal } from './components/ShortcutsModal';
import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/OverviewPage';
import { CollectionPage } from './pages/CollectionPage';
import { AccountingPage } from './pages/AccountingPage';
import { AdminPage } from './pages/AdminPage';
import { ActivityPage } from './pages/ActivityPage';
import { PatientProfilePage } from './pages/PatientProfilePage';
import { isEditableElement, matchGlobalShortcut } from './lib/shortcuts';
import { MODULES, type ModuleKey } from './modules';
import { BRAND } from './config/brand';

interface TokenTarget {
  page: string;
  token: number;
}

// Navigation is plain React state (no URL hash), so it works inside any
// sandboxed frame or preview host.
function renderPage(
  page: string,
  isOwner: boolean,
  patientId: string | null,
  openPatient: (row: Row) => void,
  back: () => void,
  newRecordReq: TokenTarget | null,
  focusSearchReq: TokenTarget | null,
  openActivity?: () => void,
): ReactNode {
  if (page === 'patient' && patientId) return <PatientProfilePage patientId={patientId} back={back} />;
  if (page.startsWith('admin:')) {
    if (!isOwner) return <OverviewPage />;
    const section = page.split(':')[1];
    if (section === 'activity') return <ActivityPage />;
    return <AdminPage section={section} />;
  }
  if (page === 'accounting') return <AccountingPage />;
  if (page in MODULES) {
    return (
      <CollectionPage
        mod={MODULES[page as ModuleKey]}
        onOpenPatient={page === 'patients' ? openPatient : undefined}
        autoOpenNewToken={newRecordReq?.page === page ? newRecordReq.token : undefined}
        focusSearchToken={focusSearchReq?.page === page ? focusSearchReq.token : undefined}
      />
    );
  }
  return <OverviewPage onOpenActivity={openActivity} />;
}

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [page, setPage] = useState('overview');
  const [patientId, setPatientId] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [newRecordReq, setNewRecordReq] = useState<TokenTarget | null>(null);
  const [focusSearchReq, setFocusSearchReq] = useState<TokenTarget | null>(null);

  const navigate = (nextPage: string) => {
    setNewRecordReq(null);
    setFocusSearchReq(null);
    setPatientId(null);
    setPage(nextPage);
  };

  useEffect(() => {
    if (!user) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const action = matchGlobalShortcut(e, isEditableElement(target));
      if (!action) return;

      e.preventDefault();
      if (action.type === 'toggle-help') {
        setShowShortcuts((open) => !open);
        return;
      }

      setShowShortcuts(false);

      if (action.type === 'navigate') {
        navigate(action.page);
        return;
      }

      if (action.type === 'new-record') {
        setPatientId(null);
        setPage(action.page);
        setNewRecordReq((prev) => ({ page: action.page, token: (prev?.token ?? 0) + 1 }));
        return;
      }

      if (action.type === 'focus-search') {
        const existingSearch = document.querySelector<HTMLInputElement>('input[role="searchbox"]');
        if (existingSearch) {
          existingSearch.focus();
          existingSearch.select();
        } else {
          setPatientId(null);
          setPage('patients');
          setFocusSearchReq((prev) => ({ page: 'patients', token: (prev?.token ?? 0) + 1 }));
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [user]);

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-gold">Loading {BRAND.company}…</div>;
  }
  if (!user) return <LoginPage />;

  const isOwner = user.role === 'owner';
  const openPatient = (row: Row) => {
    setPatientId(String(row.id));
    setPage('patient');
  };
  const back = () => navigate('patients');
  const openActivity = isOwner ? () => navigate('admin:activity') : undefined;

  return (
    <div className="min-h-screen">
      <TopNav
        page={page}
        go={navigate}
        isOwner={isOwner}
        userName={user.displayName}
        onOpenShortcuts={() => setShowShortcuts(true)}
        onSignOut={() => {
          setShowShortcuts(false);
          navigate('overview');
          signOut();
        }}
      />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div key={`${page}:${patientId ?? ''}`}>
          {renderPage(page, isOwner, patientId, openPatient, back, newRecordReq, focusSearchReq, openActivity)}
        </div>
      </main>
      <footer className="border-t border-line px-4 py-4 text-center text-xs text-muted">
        {BRAND.company} · {BRAND.product} ·{' '}
        <button type="button" onClick={() => setShowShortcuts(true)} className="text-muted underline-offset-2 hover:text-gold hover:underline">
          Press ? for keyboard shortcuts
        </button>
      </footer>
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}
