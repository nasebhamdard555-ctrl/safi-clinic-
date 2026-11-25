import { useCallback, useEffect, useState } from 'react';
import { store } from './store';
import type { Row } from './types';

export function useCollection(collection: string) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setRows(await store.list(collection));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load records.');
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { rows, loading, error, reload };
}
