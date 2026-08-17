import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getGetCameraPermissions,
  getGetCameraPermissionsAsync,
  getGetMediaLibraryPermissions,
  getGetMediaLibraryPermissionsAsync,
} from '@lynxpo/mods-image-picker';

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

function statusOf(perm: unknown): string {
  if (perm && typeof perm === 'object' && 'status' in perm) {
    return String((perm as { status: unknown }).status);
  }
  return '—';
}

/**
 * Exposes expo-image-picker permission state and lets the user request
 * permissions / launch the picker, exercising the full native method surface.
 */
export function useImagePickerInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const camera = getGetCameraPermissions();
      const media = getGetMediaLibraryPermissions();
      setRows([
        { label: 'Camera', value: statusOf(camera) },
        { label: 'Media library', value: statusOf(media) },
      ]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  const requestCamera = useCallback(async () => {
    try {
      await getGetCameraPermissionsAsync();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      refresh();
    }
  }, [refresh]);

  const requestMedia = useCallback(async () => {
    try {
      await getGetMediaLibraryPermissionsAsync();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      refresh();
    }
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    rows,
    loading,
    error,
    actions: [
      { label: 'Request camera', onPress: requestCamera },
      { label: 'Request media', onPress: requestMedia },
    ],
  };
}
