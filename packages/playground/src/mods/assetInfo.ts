import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getAssetInfoAsync,
  getIsAvailableAsync,
  getLocalUriAsync,
} from '@lynxpo/mods-asset';

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
 * Demonstrates Expo's `expo-asset` native method surface. Getters are read
 * into labeled rows and actions are exposed as buttons. Values come from the real
 * native implementation (no stubs).
 */
export function useAssetInfo(): ModuleInfo {
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
      const v_getAssetInfoAsync = getAssetInfoAsync(
        'file:///sdcard/DCIM/photo.jpg',
      );
      if (v_getAssetInfoAsync && typeof v_getAssetInfoAsync === 'object') {
        for (const [k, val] of Object.entries(v_getAssetInfoAsync)) {
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
        rows.push({ label: 'assetInfoAsync', value: '—' });
      }
      const v_getLocalUriAsync = getLocalUriAsync(
        'file:///sdcard/DCIM/photo.jpg',
      );
      rows.push({
        label: 'localUriAsync',
        value: v_getLocalUriAsync == null ? '—' : String(v_getLocalUriAsync),
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
  const actLocalUriAsync = useCallback(() => {
    try {
      getLocalUriAsync('file:///sdcard/DCIM/photo.jpg');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'localUri', onPress: actLocalUriAsync });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
