import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Row } from './types';

// One storage interface for every module. Local mode keeps data in this browser
// (falling back to memory if the browser blocks storage); Supabase mode keeps it
// in the clinic_records table (see supabase/schema.sql).
export interface Store {
  mode: 'local' | 'supabase';
  list(collection: string): Promise<Row[]>;
  insert(collection: string, data: Record<string, unknown>): Promise<Row>;
  update(collection: string, id: string, patch: Record<string, unknown>): Promise<Row>;
  put(collection: string, id: string, data: Record<string, unknown>): Promise<Row>;
  remove(collection: string, id: string): Promise<void>;
}

const newId = () =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

const newestFirst = (rows: Row[]) => rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

// Storage keys are versioned. Accounts saved by earlier builds live under the old
// prefix and are ignored, so every browser starts with the first-time admin setup.
const PREFIX = 'systech2:';
const memory = new Map<string, Row[]>();

// Removes all saved data for this system in this browser (not the shared database).
export function clearLocalData() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('systech'))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* storage blocked */
  }
  memory.clear();
}

class LocalStore implements Store {
  mode = 'local' as const;

  private read(collection: string): Row[] {
    try {
      const raw = localStorage.getItem(`${PREFIX}${collection}`);
      return raw ? (JSON.parse(raw) as Row[]) : [];
    } catch {
      return memory.get(collection) ?? [];
    }
  }

  private write(collection: string, rows: Row[]) {
    memory.set(collection, rows);
    try {
      localStorage.setItem(`${PREFIX}${collection}`, JSON.stringify(rows));
    } catch {
      // Storage is blocked here; the in-memory copy still works for this visit.
    }
  }

  async list(collection: string) {
    return newestFirst(this.read(collection));
  }

  async insert(collection: string, data: Record<string, unknown>) {
    const row = { ...data, id: newId(), createdAt: new Date().toISOString() } as Row;
    this.write(collection, [...this.read(collection), row]);
    return row;
  }

  async update(collection: string, id: string, patch: Record<string, unknown>) {
    const rows = this.read(collection);
    const i = rows.findIndex((r) => r.id === id);
    if (i < 0) throw new Error('Record not found.');
    rows[i] = { ...rows[i], ...patch, id } as Row;
    this.write(collection, rows);
    return rows[i];
  }

  async put(collection: string, id: string, data: Record<string, unknown>) {
    const rows = this.read(collection);
    const existing = rows.find((r) => r.id === id);
    const row = { ...data, id, createdAt: existing?.createdAt ?? new Date().toISOString() } as Row;
    const i = rows.findIndex((r) => r.id === id);
    if (i >= 0) rows[i] = row;
    else rows.push(row);
    this.write(collection, rows);
    return row;
  }

  async remove(collection: string, id: string) {
    this.write(collection, this.read(collection).filter((r) => r.id !== id));
  }
}

class SupabaseStore implements Store {
  mode = 'supabase' as const;

  constructor(private db: SupabaseClient) {}

  async list(collection: string) {
    const { data, error } = await this.db.from('clinic_records').select('data').eq('collection', collection);
    if (error) throw new Error(error.message);
    return newestFirst((data ?? []).map((r) => r.data as Row));
  }

  async put(collection: string, id: string, data: Record<string, unknown>) {
    const row = { createdAt: new Date().toISOString(), ...data, id } as Row;
    const { error } = await this.db.from('clinic_records').upsert({ collection, id, data: row });
    if (error) throw new Error(error.message);
    return row;
  }

  async insert(collection: string, data: Record<string, unknown>) {
    return this.put(collection, newId(), data);
  }

  async update(collection: string, id: string, patch: Record<string, unknown>) {
    const existing = (await this.list(collection)).find((r) => r.id === id);
    if (!existing) throw new Error('Record not found.');
    return this.put(collection, id, { ...existing, ...patch });
  }

  async remove(collection: string, id: string) {
    const { error } = await this.db.from('clinic_records').delete().eq('collection', collection).eq('id', id);
    if (error) throw new Error(error.message);
  }
}

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const store: Store = url && anonKey ? new SupabaseStore(createClient(url, anonKey)) : new LocalStore();
