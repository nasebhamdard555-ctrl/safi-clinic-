import type { Row } from './types';

/** Returns a compact 8-character display prefix for a record ID. */
export function formatShortId(id: string): string {
  return String(id ?? '').slice(0, 8);
}

/**
 * Filters collection rows in real time by record ID, linked patient ID,
 * patient name, or any module-configured search keys.
 */
export function filterCollectionRows(
  rows: Row[],
  query: string,
  searchKeys: string[],
  patientRows: Row[] = [],
): Row[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;

  const patientIdsByName = new Map<string, string[]>();
  for (const p of patientRows) {
    const name = String(p.fullName ?? '').trim().toLowerCase();
    const id = String(p.id ?? '').trim().toLowerCase();
    if (!name || !id) continue;
    const list = patientIdsByName.get(name);
    if (list) list.push(id);
    else patientIdsByName.set(name, [id]);
  }

  const keys = Array.from(new Set(['id', 'patientId', 'fullName', 'patientName', ...searchKeys]));

  return rows.filter((row) => {
    for (const key of keys) {
      const val = row[key];
      if (val != null && String(val).toLowerCase().includes(q)) {
        return true;
      }
    }
    const linkedName = String(row.patientName ?? '').trim().toLowerCase();
    if (linkedName) {
      const linkedIds = patientIdsByName.get(linkedName);
      if (linkedIds?.some((pid) => pid.includes(q))) {
        return true;
      }
    }
    return false;
  });
}
