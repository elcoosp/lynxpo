import { useEffect, useState } from '@lynx-js/react';
import {} from '@lynxpo/mods-haptics';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches native fields in a single synchronous pass over the bridge, returning
 * typed showcase rows. Faithful port of Expo's native module surface.
 */
export function useHapticsInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // haptics are command-only; expose capability rows
      setRows([
        { label: 'Impact', value: 'Light / Medium / Heavy' },
        { label: 'Notification', value: 'Success / Warning / Error' },
        { label: 'Selection', value: 'Supported' },
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
