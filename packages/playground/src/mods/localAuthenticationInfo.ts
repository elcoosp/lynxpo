import { useEffect, useState } from '@lynx-js/react';
import {
  getGetEnrolledLevel,
  getHasHardware,
  getIsEnrolled,
  getSupportedAuthenticationTypes,
} from '@lynxpo/mods-local-authentication';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches native biometric/auth state in a single synchronous pass over the
 * bridge, returning typed showcase rows. Faithful port of Expo's
 * expo-local-authentication surface.
 */
export function useLocalAuthenticationInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const hardware = getHasHardware();
      const enrolled = getIsEnrolled();
      const level = getGetEnrolledLevel() ?? '—';
      const types = getSupportedAuthenticationTypes() ?? '—';
      setRows([
        { label: 'Has hardware', value: hardware ? 'Yes' : 'No' },
        { label: 'Is enrolled', value: enrolled ? 'Yes' : 'No' },
        { label: 'Enrolled level', value: level },
        { label: 'Supported types', value: types || '—' },
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
