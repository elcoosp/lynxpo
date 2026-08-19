import { useEffect, useState } from '@lynx-js/react';
import { getIsSpeaking, getSupported, getVoices } from '@lynxpo/mods-speech';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches speech synthesis status and available voices in a single synchronous pass.
 * Faithful port of Expo's expo-speech native surface.
 */
export function useSpeechInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const speaking = getIsSpeaking() as unknown as boolean;
      const supported = getSupported() as unknown as boolean;
      const voices = getVoices() as unknown as unknown[];

      setRows([
        { label: 'Supported', value: supported ? 'Yes' : 'No' },
        { label: 'Speaking', value: speaking ? 'Yes' : 'No' },
        {
          label: 'Voices',
          value: `${Array.isArray(voices) ? voices.length : 0} available`,
        },
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
