import type { Role, Row } from './types';
import type { ColDef, FieldDef } from '../modules';
import { dateTime } from './format';

const FORMULA_PREFIX = /^[=+\-@\t\r]/;

/** Only administrators (clinic owners) may export clinical or financial records to CSV. */
export function canExportCsv(role?: Role | null): boolean {
  return role === 'owner';
}

/** Formats and RFC-4180 escapes a single CSV cell, neutralizing spreadsheet formula injection on text values. */
export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let text = String(value);
  if (typeof value === 'string' && FORMULA_PREFIX.test(text)) {
    text = `'${text}`;
  }
  return `"${text.replace(/"/g, '""')}"`;
}

/** Builds an RFC-4180 CSV string with CRLF line endings. */
export function buildCsvString(headers: string[], rows: unknown[][]): string {
  return [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => row.map(escapeCsvCell).join(',')),
  ].join('\r\n');
}

/**
 * Builds complete CSV headers and rows for a module collection.
 * Preserves visible table columns first (including computed columns like stockStatus),
 * then appends any remaining clinical or financial form fields not shown in the table.
 */
export function buildCollectionCsv(
  mod: { columns: ColDef[]; fields: FieldDef[] },
  rows: Row[],
): { headers: string[]; rows: unknown[][] } {
  const seen = new Set<string>();
  const exportCols: Array<{ key: string; label: string }> = [];

  for (const col of mod.columns) {
    if (!seen.has(col.key)) {
      seen.add(col.key);
      exportCols.push({ key: col.key, label: col.label });
    }
  }
  for (const field of mod.fields) {
    if (!seen.has(field.key)) {
      seen.add(field.key);
      exportCols.push({ key: field.key, label: field.label });
    }
  }

  return {
    headers: exportCols.map((c) => c.label),
    rows: rows.map((row) => exportCols.map((c) => row[c.key] ?? '')),
  };
}

/** Builds compliance-ready CSV headers and rows for the clinic audit trail / activity log. */
export function buildActivityCsv(rows: Row[]): { headers: string[]; rows: unknown[][] } {
  return {
    headers: ['Timestamp (ISO)', 'When', 'By', 'Action', 'Module', 'Details', 'Record ID'],
    rows: rows.map((row) => [
      row.createdAt ?? '',
      dateTime(row.createdAt),
      row.by ?? '',
      row.action ?? '',
      row.module ?? '',
      row.summary ?? '',
      row.id ?? '',
    ]),
  };
}

/** Exports rows as a UTF-8 with BOM CSV file suitable for Excel and Google Sheets. */
export function downloadCsv(filename: string, headers: string[], rows: unknown[][]): boolean {
  const csv = buildCsvString(headers, rows);
  try {
    const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}
