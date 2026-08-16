import { useEffect, useState } from '@lynx-js/react';
import { getClients, isAvailable } from '@lynxpo/mods-mail-composer';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches native fields in a single synchronous pass over the bridge, returning
 * typed showcase rows. Faithful port of Expo's native module surface.
 */
export function useMailComposerInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const v0 = isAvailable();
      const v1 = getClients();
      setRows([
        { label: 'Available', value: v0 ? 'Yes' : 'No' },
        { label: 'Clients', value: v1 && v1.length ? String(v1.length) : '0' },
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
