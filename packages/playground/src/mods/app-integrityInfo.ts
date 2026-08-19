import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getCodeHashAsync,
  getIntegrityTokenAsync,
  getIsAvailableAsync,
} from '@lynxpo/mods-app-integrity';

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
 * Demonstrates Expo's `expo-app-integrity` native method surface. Getters are read
 * into labeled rows and actions are exposed as buttons. Values come from the real
 * native implementation (no stubs).
 */
export function useAppIntegrityInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const rows: { label: string; value: string }[] = [];
      const v_getIsAvailableAsync = getIsAvailableAsync();
      rows.push({
        label: 'isAvailableAsync',
        value: v_getIsAvailableAsync ? 'Yes' : 'No',
      });
      const v_getIntegrityTokenAsync = getIntegrityTokenAsync('{}');
      if (
        v_getIntegrityTokenAsync &&
        typeof v_getIntegrityTokenAsync === 'object'
      ) {
        for (const [k, val] of Object.entries(v_getIntegrityTokenAsync)) {
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
        rows.push({ label: 'integrityTokenAsync', value: '—' });
      }
      const v_getCodeHashAsync = getCodeHashAsync();
      if (v_getCodeHashAsync && typeof v_getCodeHashAsync === 'object') {
        for (const [k, val] of Object.entries(v_getCodeHashAsync)) {
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
        rows.push({ label: 'codeHashAsync', value: '—' });
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
  const actIntegrityTokenAsync = useCallback(() => {
    try {
      getIntegrityTokenAsync('{}');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'integrityToken', onPress: actIntegrityTokenAsync });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
