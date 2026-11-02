import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getGetBackgroundColor,
  getSetBackgroundColor,
  getSetStatusBarBackgroundColor,
} from '@lynxpo/mods-system-ui';

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
 * Demonstrates Expo's `expo-system-ui` full native method surface: every getter is
 * read into labeled rows and every setter/action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useSystemUiInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getGetBackgroundColor = getGetBackgroundColor();
      const rows: { label: string; value: string }[] = [];
      rows.push({
        label: 'GetBackgroundColor',
        value: v_getGetBackgroundColor || '—',
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
  const actSetbgblack = useCallback(() => {
    try {
      getSetBackgroundColor('#000000');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Set bg black', onPress: actSetbgblack });
  const actSetstatusbarbgblue = useCallback(() => {
    try {
      getSetStatusBarBackgroundColor('#3b82f6');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({
    label: 'Set status-bar bg blue',
    onPress: actSetstatusbarbgblue,
  });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
