import { useEffect, useState } from '@lynx-js/react';
import { getString, hasString } from '@lynxpo/mods-clipboard';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches native fields in a single synchronous pass over the bridge, returning
 * typed showcase rows. Faithful port of Expo's native module surface.
 */
export function useClipboardInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const v0 = hasString();
      const v1 = getString();
      setRows([
        { label: 'Has string', value: v0 ? 'Yes' : 'No' },
        {
          label: 'Preview',
          value: v1 ? (v1.length > 24 ? v1.slice(0, 24) + '…' : v1) : '—',
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
