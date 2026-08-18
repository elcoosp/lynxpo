import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getGetCameraPermissions,
  getGetCameraPermissionsAsync,
  getGetMediaLibraryPermissions,
  getGetMediaLibraryPermissionsAsync,
  getLaunchCameraAsync,
  getLaunchImageLibraryAsync,
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

interface PickerResult {
  cancelled: boolean;
  uri?: string;
}

function setPickerRow(
  setRows: React.Dispatch<
    React.SetStateAction<{ label: string; value: string }[]>
  >,
  label: string,
  result: PickerResult,
  picked: string,
) {
  setRows((prev) => [
    ...prev.filter((r) => r.label !== label),
    {
      label,
      value: result.cancelled ? 'cancelled' : String(result.uri ?? picked),
    },
  ]);
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

  const launchCamera = useCallback(async () => {
    try {
      const result = (await getLaunchCameraAsync()) as PickerResult;
      setPickerRow(setRows, 'Camera result', result, 'captured');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [setRows]);

  const launchLibrary = useCallback(async () => {
    try {
      const result = (await getLaunchImageLibraryAsync()) as PickerResult;
      setPickerRow(setRows, 'Library result', result, 'picked');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [setRows]);

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
      { label: 'Launch camera', onPress: launchCamera },
      { label: 'Pick image', onPress: launchLibrary },
    ],
  };
}
