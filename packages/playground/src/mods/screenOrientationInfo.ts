import { useEffect, useState } from '@lynx-js/react';
import {
  getGetOrientation,
  getGetOrientationLock,
} from '@lynxpo/mods-screen-orientation';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches native fields in a single synchronous pass over the bridge, returning
 * typed showcase rows. Faithful port of Expo's native module surface.
 */
export function useScreenOrientationInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const v0 = getGetOrientation();
      const v1 = getGetOrientationLock();
      setRows([
        {
          label: 'Orientation',
          value:
            [
              'Unknown',
              'Portrait',
              'Portrait down',
              'Landscape left',
              'Landscape right',
            ][v0] ?? '—',
        },
        {
          label: 'Lock',
          value:
            ['Unknown', 'Portrait', 'Landscape', 'All', 'Sensor'][v1] ?? '—',
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
