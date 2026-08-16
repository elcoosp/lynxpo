import { useEffect, useState } from '@lynx-js/react';
import {
  getCameraPermissions,
  getMediaLibraryPermissions,
} from '@lynxpo/mods-image-picker';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches native fields in a single synchronous pass over the bridge, returning
 * typed showcase rows. Faithful port of Expo's native module surface.
 */
export function useImagePickerInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const v0 = getCameraPermissions();
      const v1 = getMediaLibraryPermissions();
      setRows([
        { label: 'Camera', value: v0 ? v0.status : '—' },
        { label: 'Media library', value: v1 ? v1.status : '—' },
      ]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  return { rows, loading, error };
}
