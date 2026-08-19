import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getGetPermissionsAsync,
  getGetRecordsAsync,
  getIsAvailableAsync,
  getRequestPermissionsAsync,
} from '@lynxpo/mods-health';

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
 * Demonstrates Expo's `expo-health` full native method surface: every getter is
 * read into labeled rows and every action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useHealthInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getIsAvailableAsync = getIsAvailableAsync('');
      const v_getGetPermissionsAsync = getGetPermissionsAsync(
        JSON.stringify({}),
      );
      const rows: { label: string; value: string }[] = [];
      rows.push({
        label: 'isAvailable',
        value: v_getIsAvailableAsync ? 'Yes' : 'No',
      });
      if (
        v_getGetPermissionsAsync &&
        typeof v_getGetPermissionsAsync === 'object'
      ) {
        for (const [k, val] of Object.entries(v_getGetPermissionsAsync)) {
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
        rows.push({ label: 'Permissions', value: '—' });
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
  const actRequestpermissions = useCallback(() => {
    try {
      getRequestPermissionsAsync(JSON.stringify(['Steps', 'HeartRate']));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({
    label: 'Request permissions',
    onPress: actRequestpermissions,
  });
  const actGetrecords = useCallback(() => {
    try {
      getGetRecordsAsync(JSON.stringify({ type: 'Steps' }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Get records', onPress: actGetrecords });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
