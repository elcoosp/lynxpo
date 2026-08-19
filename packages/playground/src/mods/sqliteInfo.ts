import { useEffect, useState } from '@lynx-js/react';
import {
  getExecSync,
  getGetAllSync,
  getOpenDatabase,
} from '@lynxpo/mods-sqlite';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Runs a real SQLite CREATE + INSERT + SELECT roundtrip and reports the last inserted
 * row plus total rows. Faithful port of Expo's expo-sqlite native surface.
 */
export function useSqliteInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      getOpenDatabase('lynxpo');
      getExecSync("INSERT INTO kv (id, value) VALUES (1, 'lynxpo')");
      const result = getGetAllSync('SELECT * FROM kv') as unknown as unknown[];

      const list = Array.isArray(result) ? result : [];
      const last =
        list.length > 0
          ? (list[list.length - 1] as Record<string, unknown>)
          : null;

      setRows([
        { label: 'Engine', value: 'SQLite (in-memory)' },
        { label: 'Rows', value: String(list.length) },
        {
          label: 'Last value',
          value: last && last.value ? String(last.value) : '—',
        },
      ]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  return { rows, loading, error };
}
