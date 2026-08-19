import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getContactCount,
  getContainerCount,
  getPermissionsAsync,
  getRequestPermission,
} from '@lynxpo/mods-contacts';

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
 * Fetches contacts permission state, contact count, and container count. Also exposes a
 * "Request permission" action so the runtime grant can be verified on-device.
 */
export function useContactsInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const perms = getPermissionsAsync() as unknown as { status: string };
      const contactCount = getContactCount() as unknown as number;
      const containerCount = getContainerCount() as unknown as number;

      setRows([
        { label: 'Permission', value: perms?.status ?? '—' },
        {
          label: 'Contacts',
          value: typeof contactCount === 'number' ? String(contactCount) : '—',
        },
        {
          label: 'Containers',
          value:
            typeof containerCount === 'number' ? String(containerCount) : '—',
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
