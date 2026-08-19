import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getCreateEvent,
  getGetCalendars,
  getGetPermissions,
  getRequestPermissions,
} from '@lynxpo/mods-calendar';

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
 * Demonstrates Expo's `expo-calendar` full native method surface: every getter is
 * read into labeled rows and every setter/action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useCalendarInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [lastEventId, setLastEventId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getGetCalendars = getGetCalendars();
      const v_getGetPermissions = getGetPermissions();
      const rows: { label: string; value: string }[] = [];
      rows.push({
        label: 'GetCalendars',
        value: Array.isArray(v_getGetCalendars)
          ? String(v_getGetCalendars.length)
          : '—',
      });
      if (v_getGetPermissions && typeof v_getGetPermissions === 'object') {
        for (const [k, val] of Object.entries(v_getGetPermissions)) {
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
        rows.push({ label: 'GetPermissions', value: '—' });
      }
      if (lastEventId) {
        rows.push({ label: 'Last created event', value: lastEventId });
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
  const requestPermission = useCallback(() => {
    try {
      getRequestPermissions();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 600);
    }
  }, [refresh]);
  actions.push({ label: 'Request permission', onPress: requestPermission });
  const actCreatesampleevent = useCallback(() => {
    try {
      const id = getCreateEvent('LynxPo', '2026-01-01', '2026-01-02');
      setLastEventId(id && id.length > 0 ? id : 'event-created');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Create sample event', onPress: actCreatesampleevent });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
