import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getAvailableCameraTypes,
  getAvailableVideoCodecs,
  getCameraPermissionsAsync,
  getMicrophonePermissionsAsync,
  getRequestCameraPermission,
} from '@lynxpo/mods-camera';

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
 * Fetches camera + microphone permission state and the available camera types / video
 * codecs. Also exposes a "Request camera permission" action so the runtime grant can be
 * verified on-device (mirrors the image-picker request flow).
 */
export function useCameraInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const cam = getCameraPermissionsAsync() as unknown as { status: string };
      const mic = getMicrophonePermissionsAsync() as unknown as {
        status: string;
      };
      const types = getAvailableCameraTypes() as unknown as unknown[];
      const codecs = getAvailableVideoCodecs() as unknown as unknown[];

      setRows([
        { label: 'Camera permission', value: cam?.status ?? '—' },
        { label: 'Mic permission', value: mic?.status ?? '—' },
        {
          label: 'Camera types',
          value: Array.isArray(types) ? types.join(', ') : '—',
        },
        {
          label: 'Video codecs',
          value: Array.isArray(codecs) ? codecs.join(', ') : '—',
        },
      ]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPermission = useCallback(() => {
    try {
      getRequestCameraPermission();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 600);
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
      { label: 'Request camera permission', onPress: requestPermission },
    ],
  };
}
