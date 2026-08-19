import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getAlbumsAsync,
  getAssetsAsync,
  getPermissionsAsync,
  getRequestPermission,
} from '@lynxpo/mods-media-library';

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
 * Fetches media library permission state, album count, and asset total. Also exposes a
 * "Request permission" action so the runtime grant can be verified on-device.
 */
export function useMediaLibraryInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const perms = getPermissionsAsync() as unknown as { status: string };
      const albums = getAlbumsAsync() as unknown as unknown[];
      const assets = getAssetsAsync() as unknown as { totalCount: number };

      setRows([
        { label: 'Permission', value: perms?.status ?? '—' },
        {
          label: 'Albums',
          value: String(Array.isArray(albums) ? albums.length : 0),
        },
        {
          label: 'Total assets',
          value:
            assets && typeof assets.totalCount === 'number'
              ? String(assets.totalCount)
              : '—',
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
