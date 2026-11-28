import { useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw, Search } from 'lucide-react';
import { useCollection } from '../lib/useCollection';
import { useAuth } from '../lib/auth';
import { logActivity } from '../lib/activity';
import { buildActivityCsv, canExportCsv, downloadCsv } from '../lib/csv';
import { dateTime, today } from '../lib/format';
import { Button, Card, EmptyState, PageHeader, inputCls } from '../components/ui';

export function ActivityPage() {
  const { user } = useAuth();
  const { rows, loading, reload } = useCollection('activity');
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      ['id', 'by', 'action', 'module', 'summary'].some((k) => String(r[k] ?? '').toLowerCase().includes(q)),
    );
  }, [rows, query]);

  const isAdmin = canExportCsv(user?.role);

  const exportCsv = async () => {
    if (!isAdmin || filtered.length === 0) return;
    const filename = `activity-log-${today()}.csv`;
    const { headers, rows: exportRows } = buildActivityCsv(filtered);
    const ok = downloadCsv(filename, headers, exportRows);
    if (ok) {
      const count = filtered.length;
      const unit = count === 1 ? 'entry' : 'entries';
      await logActivity(user?.displayName ?? 'Unknown', 'Exported', 'Activity log', `${count} ${unit} (${filename})`);
      await reload();
      setToast(`Exported ${count} log ${unit} to CSV.`);
    } else {
      setToast('Could not export CSV file.');
    }
  };

  return (
    <div>
      <PageHeader
        title="Activity log"
        subtitle="Who added, changed or deleted records, and when. Newest first."
        actions={
          <>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                role="searchbox"
                aria-label="Search activity log"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search activity"
                className={`${inputCls} pl-9 sm:w-64`}
              />
            </div>
            {isAdmin && (
              <Button variant="ghost" onClick={exportCsv} disabled={filtered.length === 0}>
                <Download size={16} /> Export to CSV
              </Button>
            )}
            <Button variant="ghost" onClick={reload}>
              <RefreshCw size={16} /> Refresh
            </Button>
          </>
        }
      />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-ink/40 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">By</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Module</th>
                <th className="px-4 py-3 font-medium">Details</th>
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
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <EmptyState text={query.trim() ? `No activity matches “${query.trim()}”.` : 'No activity recorded yet.'} />
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-line/60 hover:bg-gold/5">
                  <td className="whitespace-nowrap px-4 py-2.5">{dateTime(r.createdAt)}</td>
                  <td className="px-4 py-2.5">{String(r.by ?? '—')}</td>
                  <td className="px-4 py-2.5">{String(r.action ?? '—')}</td>
                  <td className="px-4 py-2.5 capitalize">{String(r.module ?? '—')}</td>
                  <td className="px-4 py-2.5">{String(r.summary ?? '—')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-line px-4 py-2 text-xs text-muted">
          {filtered.length} of {rows.length} {rows.length === 1 ? 'entry' : 'entries'}
          {query.trim() ? ` matching “${query.trim()}”` : ''}
        </div>
      </Card>

      {toast && (
        <div role="status" className="fixed bottom-5 right-5 z-50 rounded-lg border border-gold/50 bg-forest px-4 py-3 text-sm text-gold shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
