import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getGetStatus,
  getRegisterTaskAsync,
  getUnregisterTaskAsync,
} from '@lynxpo/mods-background-fetch';

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
 * Demonstrates Expo's `expo-background-fetch` full native method surface: every getter is
 * read into labeled rows and every setter/action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useBackgroundFetchInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getGetStatus = getGetStatus();
      const rows: { label: string; value: string }[] = [];
      if (v_getGetStatus && typeof v_getGetStatus === 'object') {
        for (const [k, val] of Object.entries(v_getGetStatus)) {
          rows.push({
            label: String(k),
            value:
              val == null
                ? '—'
                : typeof val === 'object'
                  ? JSON.stringify(val)
                  : String(val),
          });
        }
      } else {
        rows.push({ label: 'GetStatus', value: '—' });
      }
      setRows(rows);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  const actions: ModuleAction[] = [];
  const actRegisterfetch = useCallback(() => {
    try {
      getRegisterTaskAsync('LynxPoFetch');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Register fetch', onPress: actRegisterfetch });
  const actUnregister = useCallback(() => {
    try {
      getUnregisterTaskAsync('LynxPoFetch');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Unregister', onPress: actUnregister });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
