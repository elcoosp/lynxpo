import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getIsAvailableAsync,
  getProviderInfoAsync,
  getRedirectUriAsync,
} from '@lynxpo/mods-auth-session';

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
 * Demonstrates Expo's `expo-auth-session` native method surface. Getters are read
 * into labeled rows and actions are exposed as buttons. Values come from the real
 * native implementation (no stubs).
 */
export function useAuthSessionInfo(): ModuleInfo {
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
      const v_getRedirectUriAsync = getRedirectUriAsync();
      rows.push({
        label: 'redirectUriAsync',
        value:
          v_getRedirectUriAsync == null ? '—' : String(v_getRedirectUriAsync),
      });
      const v_getProviderInfoAsync = getProviderInfoAsync();
      if (
        v_getProviderInfoAsync &&
        typeof v_getProviderInfoAsync === 'object'
      ) {
        for (const [k, val] of Object.entries(v_getProviderInfoAsync)) {
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
        rows.push({ label: 'providerInfoAsync', value: '—' });
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
  const actProviderInfoAsync = useCallback(() => {
    try {
      getProviderInfoAsync();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'providerInfo', onPress: actProviderInfoAsync });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
