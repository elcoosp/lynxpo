import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getIsAvailableAsync,
  getThumbnailAsync,
} from '@lynxpo/mods-video-thumbnails';

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
 * Demonstrates Expo's `expo-video-thumbnails` full native method surface: every getter is
 * read into labeled rows and every action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useVideoThumbnailsInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getIsAvailableAsync = getIsAvailableAsync();
      const v_getThumbnailAsync = getThumbnailAsync('file:///sample.mp4');
      const rows: { label: string; value: string }[] = [];
      rows.push({
        label: 'isAvailable',
        value: v_getIsAvailableAsync ? 'Yes' : 'No',
      });
      if (v_getThumbnailAsync && typeof v_getThumbnailAsync === 'object') {
        for (const [k, val] of Object.entries(v_getThumbnailAsync)) {
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
        rows.push({ label: 'Thumbnail result', value: '—' });
      }
      setRows(rows);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  const actions: ModuleAction[] = [];
  const actGeneratethumbnail = useCallback(() => {
    try {
      getThumbnailAsync('file:///sample.mp4', JSON.stringify({ time: 1.0 }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Generate thumbnail', onPress: actGeneratethumbnail });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
