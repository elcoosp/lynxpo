import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getGetCacheSize,
  getIsImageLoading,
  getPrefetch,
} from '@lynxpo/mods-image';

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
 * Demonstrates Expo's `expo-image` full native method surface: every getter is
 * read into labeled rows and every setter/action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useImageInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getGetCacheSize = getGetCacheSize();
      const v_getIsImageLoading = getIsImageLoading();
      const v_getPrefetch = getPrefetch();
      const rows: { label: string; value: string }[] = [];
      rows.push({
        label: 'GetCacheSize',
        value:
          typeof v_getGetCacheSize === 'number'
            ? v_getGetCacheSize.toFixed(2)
            : '—',
      });
      rows.push({
        label: 'IsImageLoading',
        value: v_getIsImageLoading ? 'Yes' : 'No',
      });
      rows.push({ label: 'Prefetch', value: v_getPrefetch ? 'Yes' : 'No' });
      setRows(rows);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  const actions: ModuleAction[] = [];

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
