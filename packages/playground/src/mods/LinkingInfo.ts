import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getCanOpenURL,
  getGetInitialURL,
  getOpenURL,
} from '@lynxpo/mods-linking';

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
 * Demonstrates Expo's `expo-linking` full native method surface: every getter is
 * read into labeled rows and every setter/action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useLinkingInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getGetInitialURL = getGetInitialURL();
      const v_getCanOpenURL = getCanOpenURL();
      const rows: { label: string; value: string }[] = [];
      rows.push({ label: 'GetInitialURL', value: v_getGetInitialURL || '—' });
      rows.push({ label: 'CanOpenURL', value: v_getCanOpenURL ? 'Yes' : 'No' });
      setRows(rows);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  const actions: ModuleAction[] = [];
  const actOpenlynxdev = useCallback(() => {
    try {
      getOpenURL('https://lynx.dev');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Open lynx.dev', onPress: actOpenlynxdev });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
