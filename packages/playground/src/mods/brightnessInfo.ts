import { useEffect, useState } from '@lynx-js/react';
import {
  getGetBrightness,
  getGetSystemBrightnessMode,
  getIsUsingSystemBrightness,
} from '@lynxpo/mods-brightness';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches native fields in a single synchronous pass over the bridge, returning
 * typed showcase rows. Faithful port of Expo's native module surface.
 */
export function useBrightnessInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const v0 = getGetBrightness();
      const v1 = getIsUsingSystemBrightness();
      const v2 = getGetSystemBrightnessMode();
      setRows([
        {
          label: 'Brightness',
          value: v0 != null ? `${Math.round(v0 * 100)}%` : '—',
        },
        { label: 'Using system', value: v1 ? 'Yes' : 'No' },
        {
          label: 'System mode',
          value: v2 === 1 ? 'Auto' : v2 === 2 ? 'Manual' : '—',
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
