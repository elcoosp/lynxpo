import { useEffect, useState } from '@lynx-js/react';
import {
  deleteItemAsync,
  getIsAvailable,
  getItemAsync,
  setItemAsync,
} from '@lynxpo/mods-secure-store';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

const TEST_KEY = 'lynxpo_demo_key';
const TEST_VALUE = 's3cr3t-🛡️';

/**
 * Exercises the encrypted key/value store in a single synchronous pass over
 * the bridge (set → get → delete), returning typed showcase rows. Faithful
 * port of Expo's expo-secure-store surface.
 */
export function useSecureStoreInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      try {
        const available = getIsAvailable() ?? false;
        await setItemAsync(TEST_KEY, TEST_VALUE);
        const read = (await getItemAsync(TEST_KEY)) ?? '—';
        await deleteItemAsync(TEST_KEY);
        const afterDelete = await getItemAsync(TEST_KEY);
        if (!isMounted) return;
        setRows([
          { label: 'Store available', value: available ? 'Yes' : 'No' },
          { label: 'Set value', value: TEST_VALUE },
          { label: 'Read back', value: read === TEST_VALUE ? 'Match ✓' : read },
          {
            label: 'After delete',
            value: afterDelete == null ? 'Null ✓' : afterDelete || 'present',
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
