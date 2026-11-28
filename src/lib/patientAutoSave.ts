import type { Row } from './types';
import type { FieldDef } from '../modules';

export type PatientFormValues = Record<string, string>;

export interface PatientFormDiff {
  patch: Record<string, string>;
  changedLabels: string[];
}

/** Extracts string form values for all configured patient fields from a stored patient row. */
export function extractPatientForm(patient: Row, fields: FieldDef[]): PatientFormValues {
  const values: PatientFormValues = {};
  for (const field of fields) {
    const raw = patient[field.key];
    values[field.key] = raw == null ? '' : String(raw);
  }
  return values;
}

/** Validates required fields before auto-saving; returns an error message or null if valid. */
export function validatePatientForm(values: PatientFormValues, fields: FieldDef[]): string | null {
  for (const field of fields) {
    if (field.required && !String(values[field.key] ?? '').trim()) {
      return `${field.label} is required.`;
    }
  }
  return null;
}

/** Computes only the fields that changed between the last saved snapshot and current form values. */
export function getPatientFormDiff(
  saved: PatientFormValues,
  current: PatientFormValues,
  fields: FieldDef[],
): PatientFormDiff {
  const patch: Record<string, string> = {};
  const changedLabels: string[] = [];

  for (const field of fields) {
    const prev = saved[field.key] ?? '';
    const next = current[field.key] ?? '';
    if (prev !== next) {
      patch[field.key] = next;
      changedLabels.push(field.label);
    }
  }

  return { patch, changedLabels };
}

export interface AutoSaver {
  schedule: () => void;
  flush: () => Promise<void>;
  cancel: () => void;
}

/**
 * Debounced + periodic max-wait auto-save scheduler.
 * Persists changes after `debounceMs` of inactivity, and at least every `maxWaitMs`
 * during continuous editing so edits are periodically saved without manual clicks.
 */
export function createDebouncedAutoSaver(
  onSave: () => Promise<void> | void,
  { debounceMs = 800, maxWaitMs = 3000 }: { debounceMs?: number; maxWaitMs?: number } = {},
): AutoSaver {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let maxWaitTimer: ReturnType<typeof setTimeout> | null = null;
  let pending = false;

  const clearTimers = () => {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    if (maxWaitTimer !== null) {
      clearTimeout(maxWaitTimer);
      maxWaitTimer = null;
    }
  };

  const runNow = async () => {
    clearTimers();
    if (!pending) return;
    pending = false;
    await onSave();
  };

  const schedule = () => {
    pending = true;
    if (debounceTimer !== null) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      void runNow();
    }, debounceMs);

    if (maxWaitTimer === null) {
      maxWaitTimer = setTimeout(() => {
        void runNow();
      }, maxWaitMs);
    }
  };

  const flush = async () => {
    await runNow();
  };

  const cancel = () => {
    pending = false;
    clearTimers();
  };

  return { schedule, flush, cancel };
}
