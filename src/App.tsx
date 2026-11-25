import { useState, type ReactNode } from 'react';
import { useAuth } from './lib/auth';
import { TopNav } from './components/TopNav';
import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/OverviewPage';
import { CollectionPage } from './pages/CollectionPage';
import { AccountingPage } from './pages/AccountingPage';
import { AdminPage } from './pages/AdminPage';
import { MODULES, type ModuleKey } from './modules';
import { BRAND } from './config/brand';

// Navigation is plain React state (no URL hash), so it works inside any
// sandboxed frame or preview host.
function renderPage(page: string, isOwner: boolean): ReactNode {
  if (page.startsWith('admin:')) {
    if (!isOwner) return <OverviewPage />;
    return <AdminPage section={page.split(':')[1]} />;
  }
  if (page === 'accounting') return <AccountingPage />;
  if (page in MODULES) return <CollectionPage mod={MODULES[page as ModuleKey]} />;
  return <OverviewPage />;
}

export default function App() {
  const { user, loading, signOut } = useAuth();
  const [page, setPage] = useState('overview');

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-gold">Loading {BRAND.company}…</div>;
  }
  if (!user) return <LoginPage />;

  const isOwner = user.role === 'owner';
  return (
    <div className="min-h-screen">
      <TopNav page={page} go={setPage} isOwner={isOwner} userName={user.displayName} onSignOut={() => {
          setPage('overview');
          signOut();
        }} />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div key={page}>{renderPage(page, isOwner)}</div>
      </main>
      <footer className="border-t border-line px-4 py-4 text-center text-xs text-muted">
        {BRAND.company} · {BRAND.product}
      </footer>
    </div>
  );
}
