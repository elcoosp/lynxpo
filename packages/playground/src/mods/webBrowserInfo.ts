import { useEffect, useState } from '@lynx-js/react';
import { getInitialURL, getIsAvailable } from '@lynxpo/mods-web-browser';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches web-browser availability and initial URL in a single synchronous pass.
 * Faithful port of Expo's expo-web-browser native surface.
 */
export function useWebBrowserInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const available = getIsAvailable() as unknown as boolean;
      const initialURL = getInitialURL() as unknown as string;

      setRows([
        { label: 'Available', value: available ? 'Yes' : 'No' },
        { label: 'Initial URL', value: initialURL ? initialURL : 'none' },
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
