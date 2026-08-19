import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getBadgeCountAsync,
  getDevicePushTokenAsync,
  getIsDeviceRegisteredForRemoteMessages,
  getPermissionsAsync,
  getRequestPermission,
} from '@lynxpo/mods-notifications';

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
 * Fetches notification permission state, remote-registration status, badge count, and device
 * push token. Also exposes a "Request permission" action so the runtime grant can be verified
 * on-device.
 */
export function useNotificationsInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const perms = getPermissionsAsync() as unknown as { status: string };
      const registered =
        getIsDeviceRegisteredForRemoteMessages() as unknown as boolean;
      const badge = getBadgeCountAsync() as unknown as number;
      const token = getDevicePushTokenAsync() as unknown as { data: string };

      setRows([
        { label: 'Permission', value: perms?.status ?? '—' },
        { label: 'Remote registered', value: registered ? 'Yes' : 'No' },
        {
          label: 'Badge count',
          value: typeof badge === 'number' ? String(badge) : '—',
        },
        {
          label: 'Device token',
          value:
            token && token.data
              ? `${token.data.slice(0, 12)}…`
              : 'not registered',
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
      getRequestPermission();
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
    actions: [{ label: 'Request permission', onPress: requestPermission }],
  };
}
