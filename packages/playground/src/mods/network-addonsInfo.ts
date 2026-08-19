import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getAddInterceptorAsync,
  getCertificateInfoAsync,
  getIsAvailableAsync,
} from '@lynxpo/mods-network-addons';

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
 * Demonstrates Expo's `expo-network-addons` native method surface. Getters are read
 * into labeled rows and actions are exposed as buttons. Values come from the real
 * native implementation (no stubs).
 */
export function useNetworkAddonsInfo(): ModuleInfo {
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
      const v_getCertificateInfoAsync = getCertificateInfoAsync('example.com');
      if (
        v_getCertificateInfoAsync &&
        typeof v_getCertificateInfoAsync === 'object'
      ) {
        for (const [k, val] of Object.entries(v_getCertificateInfoAsync)) {
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
        rows.push({ label: 'certificateInfoAsync', value: '—' });
      }
      const v_getAddInterceptorAsync = getAddInterceptorAsync('logging');
      rows.push({
        label: 'addInterceptorAsync',
        value: v_getAddInterceptorAsync ? 'Yes' : 'No',
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
  const actAddInterceptorAsync = useCallback(() => {
    try {
      getAddInterceptorAsync('logging');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'addInterceptor', onPress: actAddInterceptorAsync });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
