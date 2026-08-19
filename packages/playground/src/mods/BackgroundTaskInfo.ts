import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getIsAvailableAsync,
  getRegisterTaskAsync,
  getStatus,
  getUnregisterTaskAsync,
} from '@lynxpo/mods-background-task';

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
 * Demonstrates Expo's `expo-background-task` full native method surface: every getter is
 * read into labeled rows and every action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useBackgroundTaskInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getIsAvailableAsync = getIsAvailableAsync();
      const v_getStatus = getStatus();
      const rows: { label: string; value: string }[] = [];
      rows.push({
        label: 'isAvailable',
        value: v_getIsAvailableAsync ? 'Yes' : 'No',
      });
      if (v_getStatus && typeof v_getStatus === 'object') {
        for (const [k, val] of Object.entries(v_getStatus)) {
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
        rows.push({ label: 'Status', value: '—' });
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
  const actRegistertask = useCallback(() => {
    try {
      getRegisterTaskAsync(
        'LynxPoBgTask',
        JSON.stringify({ minimumInterval: 15 }),
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Register task', onPress: actRegistertask });
  const actUnregistertask = useCallback(() => {
    try {
      getUnregisterTaskAsync('LynxPoBgTask');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Unregister task', onPress: actUnregistertask });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
