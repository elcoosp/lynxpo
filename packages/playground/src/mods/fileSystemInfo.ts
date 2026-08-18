import { useEffect, useState } from '@lynx-js/react';
import {
  deleteAsync,
  getInfoAsync,
  readAsStringAsync,
  writeAsStringAsync,
} from '@lynxpo/mods-file-system';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

const TEST_PATH = 'lynxpo_demo/hello.txt';
const TEST_VALUE = 'hello filesystem 🗂️';

/**
 * Exercises the scoped file system in a single pass over the bridge
 * (write -> read -> info -> delete), returning typed showcase rows.
 * Faithful port of Expo's expo-file-system core surface.
 */
export function useFileSystemInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      try {
        await writeAsStringAsync(TEST_PATH, TEST_VALUE);
        const read = await readAsStringAsync(TEST_PATH);
        const info = await getInfoAsync(TEST_PATH);
        await deleteAsync(TEST_PATH);
        const afterDelete = await getInfoAsync(TEST_PATH);
        if (!isMounted) return;
        setRows([
          { label: 'Wrote', value: TEST_VALUE },
          { label: 'Read back', value: read === TEST_VALUE ? 'Match ✓' : read },
          {
            label: 'Info (size)',
            value: `${info.exists ? 'exists' : 'missing'} / ${info.size}B`,
          },
          {
            label: 'After delete',
            value: afterDelete.exists ? 'still present' : 'Gone ✓',
          },
        ]);
        setError(null);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, []);

  return { rows, loading, error };
}
