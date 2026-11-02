import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getCanOpenURL,
  getStartActivity,
  getStartActivityAsync,
} from '@lynxpo/mods-intent-launcher';

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
 * Demonstrates Expo's `expo-intent-launcher` full native method surface: every getter is
 * read into labeled rows and every action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useIntentLauncherInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getCanOpenURL = getCanOpenURL('');
      const rows: { label: string; value: string }[] = [];
      rows.push({ label: 'canOpenURL', value: v_getCanOpenURL ? 'Yes' : 'No' });
      setRows(rows);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  const actions: ModuleAction[] = [];
  const actOpenbrowser = useCallback(() => {
    try {
      getStartActivity('android.intent.action.VIEW', 'https://lynxjs.org');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Open browser', onPress: actOpenbrowser });
  const actStartactivityasync = useCallback(() => {
    try {
      getStartActivityAsync(
        JSON.stringify({
          action: 'android.intent.action.VIEW',
          data: 'https://lynxjs.org',
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({
    label: 'Start activity async',
    onPress: actStartactivityasync,
  });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
