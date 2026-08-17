import { useCallback, useEffect, useState } from '@lynx-js/react';
import {
  getGetString,
  getHasString,
  getSetStringAsync,
} from '@lynxpo/mods-clipboard';

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

function readClipboard(): { has: boolean; text: string | null } {
  const has = getHasString();
  const text = getGetString();
  return { has: !!has, text: text ?? null };
}

/**
 * Interactive clipboard demo: reads the current clipboard and lets the user
 * write a sample string, faithfully exercising expo-clipboard's get/set/has
 * surface over the native bridge.
 */
export function useClipboardInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const { has, text } = readClipboard();
      setRows([
        { label: 'Has string', value: has ? 'Yes' : 'No' },
        {
          label: 'Preview',
          value: text
            ? text.length > 24
              ? text.slice(0, 24) + '…'
              : text
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

  const copySample = useCallback(async () => {
    try {
      await getSetStringAsync('LynxPo 🚀 native clipboard');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      refresh();
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
      { label: 'Copy sample', onPress: copySample },
      { label: 'Refresh', onPress: refresh },
    ],
  };
}
