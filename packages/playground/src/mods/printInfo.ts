import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getIsAvailable,
  getPrintAsync,
  getSelectPrinter,
} from '@lynxpo/mods-print';

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
 * Demonstrates Expo's `expo-print` full native method surface: every getter is
 * read into labeled rows and every setter/action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function usePrintInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getIsAvailable = getIsAvailable();
      const v_getSelectPrinter = getSelectPrinter();
      const rows: { label: string; value: string }[] = [];
      rows.push({
        label: 'IsAvailable',
        value: v_getIsAvailable ? 'Yes' : 'No',
      });
      if (v_getSelectPrinter && typeof v_getSelectPrinter === 'object') {
        for (const [k, val] of Object.entries(v_getSelectPrinter)) {
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
        rows.push({ label: 'SelectPrinter', value: '—' });
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
  const actPrinttest = useCallback(() => {
    try {
      getPrintAsync('/tmp/test.pdf');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Print test', onPress: actPrinttest });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
