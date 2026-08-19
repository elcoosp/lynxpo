import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getCurrentPositionAsync,
  getPermissionsAsync,
  getProviderStatus,
  getRequestPermission,
} from '@lynxpo/mods-location';

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
 * Fetches location provider status, permission state, and last known position. Also
 * exposes a "Request permission" action so the runtime grant can be verified on-device.
 */
export function useLocationInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const status = getProviderStatus() as unknown as Record<string, boolean>;
      const perms = getPermissionsAsync() as unknown as {
        status: string;
        granted: boolean;
      };
      const pos = getCurrentPositionAsync() as unknown as {
        latitude: number;
        longitude: number;
        accuracy: number;
      };

      const accuracy =
        typeof pos.accuracy === 'number' && pos.accuracy >= 0
          ? `${pos.accuracy.toFixed(0)} m`
          : 'unauthorized';

      setRows([
        {
          label: 'Services enabled',
          value: status?.locationServicesEnabled ? 'Yes' : 'No',
        },
        { label: 'GPS available', value: status?.gpsAvailable ? 'Yes' : 'No' },
        {
          label: 'Network available',
          value: status?.networkAvailable ? 'Yes' : 'No',
        },
        { label: 'Permission', value: perms?.status ?? '—' },
        {
          label: 'Latitude',
          value:
            typeof pos.latitude === 'number' && pos.accuracy >= 0
              ? pos.latitude.toFixed(4)
              : '—',
        },
        {
          label: 'Longitude',
          value:
            typeof pos.longitude === 'number' && pos.accuracy >= 0
              ? pos.longitude.toFixed(4)
              : '—',
        },
        { label: 'Accuracy', value: accuracy },
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
      getRequestPermission();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      // The grant lands asynchronously; refresh after a short delay.
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
    actions: [{ label: 'Request permission', onPress: requestPermission }],
  };
}
