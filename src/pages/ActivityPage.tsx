import { useMemo, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { useCollection } from '../lib/useCollection';
import { dateTime } from '../lib/format';
import { Button, Card, EmptyState, PageHeader, inputCls } from '../components/ui';

export function ActivityPage() {
  const { rows, loading, reload } = useCollection('activity');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => ['by', 'action', 'module', 'summary'].some((k) => String(r[k] ?? '').toLowerCase().includes(q)));
  }, [rows, query]);

  return (
    <div>
      <PageHeader
        title="Activity log"
        subtitle="Who added, changed or deleted records, and when. Newest first."
        actions={
          <>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search activity" className={`${inputCls} pl-9 sm:w-64`} />
            </div>
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
                    <EmptyState text="No activity recorded yet." />
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-line/60">
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
      </Card>
    </div>
  );
}
