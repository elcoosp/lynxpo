import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getGetRegisteredTasks,
  getIsTaskRegistered,
  getRegisterTaskAsync,
  getUnregisterTaskAsync,
} from '@lynxpo/mods-task-manager';

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
 * Demonstrates Expo's `expo-task-manager` full native method surface: every getter is
 * read into labeled rows and every setter/action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useTaskManagerInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getGetRegisteredTasks = getGetRegisteredTasks();
      const v_getIsTaskRegistered = getIsTaskRegistered();
      const rows: { label: string; value: string }[] = [];
      rows.push({
        label: 'GetRegisteredTasks',
        value: Array.isArray(v_getGetRegisteredTasks)
          ? String(v_getGetRegisteredTasks.length)
          : '—',
      });
      rows.push({
        label: 'IsTaskRegistered',
        value: v_getIsTaskRegistered ? 'Yes' : 'No',
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
  const actRegisterdemotask = useCallback(() => {
    try {
      getRegisterTaskAsync('LynxPoTask');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Register demo task', onPress: actRegisterdemotask });
  const actUnregister = useCallback(() => {
    try {
      getUnregisterTaskAsync('LynxPoTask');
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
