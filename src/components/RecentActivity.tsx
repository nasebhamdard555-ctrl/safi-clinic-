import { useMemo, useState } from 'react';
import { ArrowRight, History, RefreshCw } from 'lucide-react';
import {
  ACTIVITY_FILTERS,
  filterRecentActivity,
  formatActivityModule,
  getActivityActionTone,
  type ActivityFilter,
} from '../lib/activityFeed';
import { dateTime } from '../lib/format';
import type { Row } from '../lib/types';
import { Badge, Card, EmptyState } from './ui';

export function RecentActivity({
  rows,
  loading,
  onRefresh,
  onViewAll,
  limit = 8,
}: {
  rows: Row[];
  loading: boolean;
  onRefresh: () => void;
  onViewAll?: () => void;
  limit?: number;
}) {
  const [filter, setFilter] = useState<ActivityFilter>('all');

  const visible = useMemo(() => filterRecentActivity(rows, filter, limit), [rows, filter, limit]);

  return (
    <Card className="mt-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <History size={16} className="text-gold" aria-hidden="true" />
          <h2 className="font-semibold text-gold">Recent Activity</h2>
          <span className="text-xs text-muted">
            ({visible.length}
            {rows.length > visible.length ? ` of ${rows.length}` : ''})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-line bg-ink/40 p-0.5" role="group" aria-label="Filter recent activity">
            {ACTIVITY_FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    active ? 'bg-gold/20 text-gold' : 'text-muted hover:text-cream'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onRefresh}
            aria-label="Refresh recent activity"
            className="inline-flex items-center gap-1 rounded-md border border-line px-2.5 py-1.5 text-xs text-muted transition hover:border-gold hover:text-gold"
          >
            <RefreshCw size={13} />
            Refresh
          </button>

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="inline-flex items-center gap-1 rounded-md border border-gold/40 bg-gold/10 px-2.5 py-1.5 text-xs font-medium text-gold transition hover:bg-gold/20"
            >
              Full log
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="px-4 py-6 text-sm text-muted">Loading recent activity…</p>
      ) : visible.length === 0 ? (
        <EmptyState
          text={
            filter === 'all'
              ? 'No audit activity recorded yet. Patient registrations, appointment updates, and financial transactions will appear here.'
              : `No ${filter} activity recorded yet.`
          }
        />
      ) : (
        <ul className="divide-y divide-line/60">
          {visible.map((entry) => {
            const action = String(entry.action ?? 'Updated');
            const moduleLabel = formatActivityModule(entry.module);
            const summary = String(entry.summary ?? '—');
            const actor = String(entry.by ?? 'Unknown');
            return (
              <li key={entry.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-gold/5">
                <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                  <Badge tone={getActivityActionTone(action)}>{action}</Badge>
                  <span className="rounded border border-line bg-ink/50 px-2 py-0.5 text-xs text-muted">{moduleLabel}</span>
                  <span className="truncate font-medium text-cream">{summary}</span>
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-3 text-xs text-muted">
                  <span>by {actor}</span>
                  <span className="font-mono text-[11px]">{dateTime(entry.createdAt)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
