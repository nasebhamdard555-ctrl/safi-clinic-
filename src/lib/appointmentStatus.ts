import type { Row } from './types';

export const OVERVIEW_WORKFLOW_STATUSES = ['Pending', 'Confirmed', 'Completed'] as const;
export type WorkflowStatus = (typeof OVERVIEW_WORKFLOW_STATUSES)[number];

export type StatusIndicatorTone = 'gold' | 'ok' | 'danger' | 'neutral';

export interface AppointmentStatusMeta {
  label: string;
  tone: StatusIndicatorTone;
  dotClass: string;
  indicatorClass: string;
}

/** Returns consistent visual indicator metadata for any appointment status string. */
export function getAppointmentStatusMeta(status: unknown): AppointmentStatusMeta {
  const label = String(status ?? '').trim() || 'Pending';
  if (/cancel|no show/i.test(label)) {
    return {
      label,
      tone: 'danger',
      dotClass: 'bg-danger',
      indicatorClass: 'border-danger/50 bg-danger/10 text-danger',
    };
  }
  if (/complete/i.test(label)) {
    return {
      label,
      tone: 'ok',
      dotClass: 'bg-ok',
      indicatorClass: 'border-ok/60 bg-ok/15 text-ok',
    };
  }
  if (/confirm|checked in/i.test(label)) {
    return {
      label,
      tone: 'ok',
      dotClass: 'bg-ok',
      indicatorClass: 'border-ok/45 bg-ok/5 text-ok',
    };
  }
  if (/pending|sched/i.test(label)) {
    return {
      label,
      tone: 'gold',
      dotClass: 'bg-gold',
      indicatorClass: 'border-gold/50 bg-gold/10 text-gold',
    };
  }
  return {
    label,
    tone: 'neutral',
    dotClass: 'bg-muted',
    indicatorClass: 'border-line bg-ink/40 text-muted',
  };
}

/** Returns true if a row already matches the target workflow status. */
export function isWorkflowStatusActive(currentStatus: unknown, target: WorkflowStatus): boolean {
  return String(currentStatus ?? '').trim().toLowerCase() === target.toLowerCase();
}

/** Filters and sorts upcoming non-cancelled appointments for the OverviewPage list. */
export function getUpcomingAppointments(rows: Row[], todayStr: string, limit = 6): Row[] {
  return rows
    .filter((a) => String(a.date ?? '') >= todayStr && String(a.status ?? '') !== 'Cancelled')
    .sort((a, b) => (String(a.date ?? '') < String(b.date ?? '') ? -1 : 1))
    .slice(0, limit);
}

/** Summarizes today's appointments by workflow stage for the OverviewPage KPI hint. */
export function summarizeTodayAppointments(rows: Row[], todayStr: string): {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
} {
  const todays = rows.filter((a) => String(a.date ?? '').startsWith(todayStr));
  let pending = 0;
  let confirmed = 0;
  let completed = 0;

  for (const row of todays) {
    const s = String(row.status ?? '');
    if (/complete/i.test(s)) completed += 1;
    else if (/confirm|checked in/i.test(s)) confirmed += 1;
    else if (/pending|sched/i.test(s)) pending += 1;
  }

  return { total: todays.length, pending, confirmed, completed };
}
