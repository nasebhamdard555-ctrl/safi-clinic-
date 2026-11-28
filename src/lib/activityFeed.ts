import { money } from './format';
import type { Row } from './types';

export type ActivityDomain = 'patients' | 'clinical' | 'financial' | 'other';
export type ActivityFilter = 'all' | 'patients' | 'clinical' | 'financial';
export type ActivityTone = 'ok' | 'gold' | 'danger' | 'neutral';

export const ACTIVITY_FILTERS: Array<{ id: ActivityFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'patients', label: 'Patients' },
  { id: 'clinical', label: 'Clinical' },
  { id: 'financial', label: 'Financial' },
];

/** Classifies an activity row's module into a high-level clinic audit domain. */
export function classifyActivityModule(moduleName: unknown): ActivityDomain {
  const m = String(moduleName ?? '').trim().toLowerCase();
  if (/patient/.test(m)) return 'patients';
  if (/entry|account|income|expense|sale|dispens/.test(m)) return 'financial';
  if (/appointment|consult|inventory|item/.test(m)) return 'clinical';
  return 'other';
}

/** Returns a display label for an activity module. */
export function formatActivityModule(moduleName: unknown): string {
  const raw = String(moduleName ?? '').trim();
  if (!raw) return 'Record';
  if (raw.toLowerCase() === 'entry') return 'Financial entry';
  if (raw.toLowerCase() === 'sale') return 'Pharmacy sale';
  return raw[0].toUpperCase() + raw.slice(1);
}

/** Maps an audit action verb to a visual tone. */
export function getActivityActionTone(action: unknown): ActivityTone {
  const a = String(action ?? '').trim().toLowerCase();
  if (/add|creat/.test(a)) return 'ok';
  if (/updat|notif|export/.test(a)) return 'gold';
  if (/delet|remov/.test(a)) return 'danger';
  return 'neutral';
}

/** Sorts activity entries newest-first, filters by domain category, and limits the result count. */
export function filterRecentActivity(rows: Row[], filter: ActivityFilter, limit = 10): Row[] {
  const sorted = [...rows].sort((a, b) => (String(a.createdAt ?? '') < String(b.createdAt ?? '') ? 1 : -1));
  const matched = filter === 'all' ? sorted : sorted.filter((r) => classifyActivityModule(r.module) === filter);
  return matched.slice(0, limit);
}

/** Builds an informative audit summary string for a newly saved or deleted record. */
export function formatRecordActivitySummary(
  collection: string,
  data: Record<string, unknown>,
  fallbackLabel: string,
): string {
  if (collection === 'accounting') {
    const type = String(data.type ?? '').trim();
    const desc = String(data.description ?? data.category ?? '').trim();
    const amount = data.amount !== undefined && data.amount !== '' ? money(data.amount) : '';
    const head = [type, desc].filter(Boolean).join(': ');
    return [head || fallbackLabel, amount ? `(${amount})` : ''].filter(Boolean).join(' ');
  }
  if (collection === 'dispensing') {
    const patient = String(data.patientName ?? '').trim() || 'Walk-in';
    const items = String(data.items ?? '').trim();
    const amount = data.amount !== undefined && data.amount !== '' ? money(data.amount) : '';
    const head = [patient, items].filter(Boolean).join(' · ');
    return [head || fallbackLabel, amount ? `(${amount})` : ''].filter(Boolean).join(' ');
  }
  if (collection === 'appointments') {
    const patient = String(data.patientName ?? '').trim();
    const reason = String(data.reason ?? '').trim();
    return [patient, reason].filter(Boolean).join(' · ') || fallbackLabel;
  }
  if (collection === 'consultations') {
    const patient = String(data.patientName ?? '').trim();
    const diagnosis = String(data.diagnosis ?? '').trim();
    return [patient, diagnosis].filter(Boolean).join(' · ') || fallbackLabel;
  }
  return String(data.fullName ?? data.name ?? fallbackLabel ?? '').trim() || fallbackLabel;
}
