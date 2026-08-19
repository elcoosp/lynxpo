import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getIsAvailableAsync,
  getManipulateAsync,
} from '@lynxpo/mods-image-manipulator';

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
 * Demonstrates Expo's `expo-image-manipulator` full native method surface: every getter is
 * read into labeled rows and every action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useImageManipulatorInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getIsAvailableAsync = getIsAvailableAsync();
      const v_getManipulateAsync = getManipulateAsync(
        'file:///sample.png',
        JSON.stringify(['resize', 'rotate']),
        JSON.stringify({ compress: 0.8 }),
      );
      const rows: { label: string; value: string }[] = [];
      rows.push({
        label: 'isAvailable (uri)',
        value: v_getIsAvailableAsync ? 'Yes' : 'No',
      });
      if (v_getManipulateAsync && typeof v_getManipulateAsync === 'object') {
        for (const [k, val] of Object.entries(v_getManipulateAsync)) {
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
        rows.push({ label: 'Manipulate result', value: '—' });
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
  const actManipulatesample = useCallback(() => {
    try {
      getManipulateAsync(
        'file:///sample.png',
        JSON.stringify(['resize', 'rotate']),
        JSON.stringify({ compress: 0.8 }),
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Manipulate sample', onPress: actManipulatesample });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
