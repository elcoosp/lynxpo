import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getCredentialAsync,
  getCredentialStateAsync,
  getIsAvailableAsync,
} from '@lynxpo/mods-apple-authentication';

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
 * Demonstrates Expo's `expo-apple-authentication` native method surface. Getters are read
 * into labeled rows and actions are exposed as buttons. Values come from the real
 * native implementation (no stubs).
 */
export function useAppleAuthenticationInfo(): ModuleInfo {
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
      const v_getCredentialAsync = getCredentialAsync('{}');
      if (v_getCredentialAsync && typeof v_getCredentialAsync === 'object') {
        for (const [k, val] of Object.entries(v_getCredentialAsync)) {
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
        rows.push({ label: 'credentialAsync', value: '—' });
      }
      const v_getCredentialStateAsync =
        getCredentialStateAsync('000000.000000.0000');
      rows.push({
        label: 'credentialStateAsync',
        value:
          v_getCredentialStateAsync == null
            ? '—'
            : String(v_getCredentialStateAsync),
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
  const actCredentialAsync = useCallback(() => {
    try {
      getCredentialAsync('{}');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'credential', onPress: actCredentialAsync });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
