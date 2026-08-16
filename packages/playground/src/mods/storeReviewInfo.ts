import { useEffect, useState } from '@lynx-js/react';
import { isAvailable } from '@lynxpo/mods-store-review';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches native fields in a single synchronous pass over the bridge, returning
 * typed showcase rows. Faithful port of Expo's native module surface.
 */
export function useStoreReviewInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const v0 = isAvailable();
      setRows([{ label: 'Available', value: v0 ? 'Yes' : 'No' }]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  return { rows, loading, error };
}
