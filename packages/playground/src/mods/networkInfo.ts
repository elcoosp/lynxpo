import { useEffect, useState } from '@lynx-js/react';
import { getGetIpAddress, getGetNetworkState } from '@lynxpo/mods-network';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches native fields in a single synchronous pass over the bridge, returning
 * typed showcase rows. Faithful port of Expo's native module surface.
 */
export function useNetworkInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const v0 = getGetIpAddress();
      const v1 = getGetNetworkState();
      setRows([
        { label: 'IP address', value: v0 ?? '—' },
        { label: 'Connected', value: v1 && v1.isConnected ? 'Yes' : 'No' },
        {
          label: 'Type',
          value: v1 ? (['Unknown', 'Wifi', 'Cellular'][v1.type] ?? '—') : '—',
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
