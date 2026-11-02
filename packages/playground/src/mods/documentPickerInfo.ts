import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getDocumentAsync,
  getIsAvailableAsync,
} from '@lynxpo/mods-document-picker';

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
 * Demonstrates Expo's `expo-document-picker` full native method surface: every getter is
 * read into labeled rows and every action is exposed as a button. Values are
 * rendered through the Lynx bridge with no native runtime changes required.
 */
export function useDocumentPickerInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const v_getIsAvailableAsync = getIsAvailableAsync();
      const v_getDocumentAsync = getDocumentAsync(JSON.stringify({}));
      const rows: { label: string; value: string }[] = [];
      rows.push({
        label: 'isAvailable',
        value: v_getIsAvailableAsync ? 'Yes' : 'No',
      });
      if (v_getDocumentAsync && typeof v_getDocumentAsync === 'object') {
        for (const [k, val] of Object.entries(v_getDocumentAsync)) {
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
        rows.push({ label: 'Document result', value: '—' });
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
  const actPickdocument = useCallback(() => {
    try {
      getDocumentAsync(
        JSON.stringify({ type: 'image/*', copyToCacheDirectory: true }),
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setTimeout(refresh, 300);
    }
  }, [refresh]);
  actions.push({ label: 'Pick document', onPress: actPickdocument });

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, actions };
}
