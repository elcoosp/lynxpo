import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getAllowScreenCapture,
  getIsAvailableAsync,
  getPermissionsAsync,
  getPreventScreenCapture,
  getRequestPermissionsAsync,
} from '@lynxpo/mods-screen-capture';

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
 * Demonstrates Expo's `expo-screen-capture` full native method surface: every getter is
 * read into labeled rows and every action is exposed as a button. prevent/allow toggle
 * FLAG_SECURE on the host window; permissions report granted (explorer cannot prompt).
 */
export function useScreenCaptureInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getIsAvailableAsync = getIsAvailableAsync();
      const v_getPermissionsAsync = getPermissionsAsync();
      const rows: { label: string; value: string }[] = [];
      rows.push({
        label: 'isAvailable',
        value: v_getIsAvailableAsync ? 'Yes' : 'No',
      });
      if (v_getPermissionsAsync && typeof v_getPermissionsAsync === 'object') {
        for (const [k, val] of Object.entries(v_getPermissionsAsync)) {
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
  const actPreventscreencapture = useCallback(() => {
    try {
      getPreventScreenCapture();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Prevent capture', onPress: actPreventscreencapture });

  const actAllowscreencapture = useCallback(() => {
    try {
      getAllowScreenCapture();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Allow capture', onPress: actAllowscreencapture });

  const actRequestpermissions = useCallback(() => {
    try {
      getRequestPermissionsAsync();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Request permission', onPress: actRequestpermissions });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
