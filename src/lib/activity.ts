import { store } from './store';

// Records who changed what. Logging must never block saving, so errors are ignored.
export async function logActivity(by: string, action: string, module: string, summary: string) {
  try {
    await store.insert('activity', { by, action, module, summary });
  } catch {
    /* ignore */
  }
}
