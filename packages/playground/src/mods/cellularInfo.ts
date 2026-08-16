import { useEffect, useState } from '@lynx-js/react';
import {
  getGetCarrierName,
  getGetCellularGeneration,
  getGetIsoCountryCode,
  getGetMobileCountryCode,
  getGetMobileNetworkCode,
} from '@lynxpo/mods-cellular';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches native fields in a single synchronous pass over the bridge, returning
 * typed showcase rows. Faithful port of Expo's native module surface.
 */
export function useCellularInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const v0 = getGetCellularGeneration();
      const v1 = getGetCarrierName();
      const v2 = getGetIsoCountryCode();
      const v3 = getGetMobileCountryCode();
      const v4 = getGetMobileNetworkCode();
      setRows([
        {
          label: 'Generation',
          value: ['Unknown', '2G', '3G', '4G', '5G'][v0] ?? '—',
        },
        { label: 'Carrier', value: v1 ?? '—' },
        { label: 'Country', value: v2 ?? '—' },
        { label: 'MCC', value: v3 ?? '—' },
        { label: 'MNC', value: v4 ?? '—' },
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
