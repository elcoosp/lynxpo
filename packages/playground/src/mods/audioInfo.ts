import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getGetStatus,
  getPause,
  getPlay,
  getSetIsLooping,
  getSetVolume,
} from '@lynxpo/mods-audio';

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
 * Demonstrates Expo's `expo-audio` full native method surface: every getter is
 * read into labeled rows and every setter/action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useAudioInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getGetStatus = getGetStatus();
      const rows: { label: string; value: string }[] = [];
      if (v_getGetStatus && typeof v_getGetStatus === 'object') {
        for (const [k, val] of Object.entries(v_getGetStatus)) {
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
        rows.push({ label: 'GetStatus', value: '—' });
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
  const actPause = useCallback(() => {
    try {
      getPause();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Pause', onPress: actPause });
  const actPlay = useCallback(() => {
    try {
      getPlay();
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Play', onPress: actPlay });
  const actSetvolume05 = useCallback(() => {
    try {
      getSetVolume(0.5);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Set volume 0.5', onPress: actSetvolume05 });
  const actLoopon = useCallback(() => {
    try {
      getSetIsLooping(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Loop on', onPress: actLoopon });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
