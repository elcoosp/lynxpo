import { useEffect, useState } from '@lynx-js/react';
import { getIsLoaded, getLoadedFonts } from '@lynxpo/mods-font';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
  actions: { label: string; onPress: () => void }[];
}

/**
 * Fetches loaded fonts and exposes a load action. Faithful port of Expo's
 * expo-font native surface (getLoadedFonts / isLoaded / loadAsync).
 */
export function useFontInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = () => {
    try {
      const loaded = getLoadedFonts() as unknown as string[];
      const list = Array.isArray(loaded) ? loaded : [];
      setRows([
        { label: 'Loaded fonts', value: String(list.length) },
        {
          label: 'Sample',
          value: list.length > 0 ? list[0] : 'none (use Load sample)',
        },
      ]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const actions = [
    {
      label: 'Load sample',
      onPress: () => {
        try {
          // loadAsync is a command exposed as getLoadAsync in the ktts output.
          const mod = require('@lynxpo/mods-font') as {
            getLoadAsync?: (family: string) => void;
          };
          mod.getLoadAsync?.('LynxPoSans');
          refresh();
        } catch (err) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      },
    },
  ];

  return { rows, loading, error, actions };
}
