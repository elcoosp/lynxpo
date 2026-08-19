import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getGetAuthorizationStatus,
  getRequestAuthorization,
} from '@lynxpo/mods-tracking-transparency';

export interface ModuleAction {
  label: string;
  onPress: () => void;
}
export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
  actions: ModuleAction[];
}

/**
 * Demonstrates Expo's `expo-tracking-transparency` full native method surface: every getter is
 * read into labeled rows and every setter/action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useTrackingTransparencyInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getGetAuthorizationStatus = getGetAuthorizationStatus();
      const rows: { label: string; value: string }[] = [];
      rows.push({
        label: 'GetAuthorizationStatus',
        value: v_getGetAuthorizationStatus || '—',
      });
      setRows(rows);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  const actions: ModuleAction[] = [];
  const requestPermission = useCallback(() => {
    try {
      getRequestAuthorization();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 600);
    }
  }, [refresh]);
  actions.push({ label: 'Request permission', onPress: requestPermission });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
