import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getIsAvailableAsync,
  getIsLivePhotoAsync,
  getSaveLivePhotoAsync,
} from '@lynxpo/mods-live-photo';

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
 * Demonstrates Expo's `expo-live-photo` native method surface. Getters are read
 * into labeled rows and actions are exposed as buttons. Values come from the real
 * native implementation (no stubs).
 */
export function useLivePhotoInfo(): ModuleInfo {
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
      const v_getIsLivePhotoAsync = getIsLivePhotoAsync(
        '/sdcard/DCIM/live.heic',
      );
      rows.push({
        label: 'isLivePhotoAsync',
        value: v_getIsLivePhotoAsync ? 'Yes' : 'No',
      });
      const v_getSaveLivePhotoAsync = getSaveLivePhotoAsync(
        '/a.mp4',
        '/b.heic',
      );
      rows.push({
        label: 'saveLivePhotoAsync',
        value: v_getSaveLivePhotoAsync ? 'Yes' : 'No',
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
  const actSaveLivePhotoAsync = useCallback(() => {
    try {
      getSaveLivePhotoAsync('/a.mp4', '/b.heic');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'saveLivePhoto', onPress: actSaveLivePhotoAsync });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
