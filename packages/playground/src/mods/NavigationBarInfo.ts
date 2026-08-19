import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getGetVisibility,
  getSetBackgroundColor,
  getSetButtonStyle,
  getSetVisibility,
} from '@lynxpo/mods-navigation-bar';

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
 * Demonstrates Expo's `expo-navigation-bar` full native method surface: every getter is
 * read into labeled rows and every setter/action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useNavigationBarInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getGetVisibility = getGetVisibility();
      const rows: { label: string; value: string }[] = [];
      if (v_getGetVisibility && typeof v_getGetVisibility === 'object') {
        for (const [k, val] of Object.entries(v_getGetVisibility)) {
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
        rows.push({ label: 'GetVisibility', value: '—' });
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
  const actHide = useCallback(() => {
    try {
      getSetVisibility(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Hide', onPress: actHide });
  const actShow = useCallback(() => {
    try {
      getSetVisibility(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Show', onPress: actShow });
  const actSetdarkbuttons = useCallback(() => {
    try {
      getSetButtonStyle('dark');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Set dark buttons', onPress: actSetdarkbuttons });
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

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
