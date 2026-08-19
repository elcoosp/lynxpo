import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getDigestAsync,
  getIsAvailableAsync,
  getRandomBytesAsync,
} from '@lynxpo/mods-standard-web-crypto';

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
 * Demonstrates Expo's `expo-standard-web-crypto` native method surface. Getters are read
 * into labeled rows and actions are exposed as buttons. Values come from the real
 * native implementation (no stubs).
 */
export function useStandardWebCryptoInfo(): ModuleInfo {
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
      const v_getRandomBytesAsync = getRandomBytesAsync('16');
      rows.push({
        label: 'randomBytesAsync',
        value:
          v_getRandomBytesAsync == null ? '—' : String(v_getRandomBytesAsync),
      });
      const v_getDigestAsync = getDigestAsync('SHA-256', 'hello');
      rows.push({
        label: 'digestAsync',
        value: v_getDigestAsync == null ? '—' : String(v_getDigestAsync),
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
  const actRandomBytesAsync = useCallback(() => {
    try {
      getRandomBytesAsync('16');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'randomBytes', onPress: actRandomBytesAsync });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
