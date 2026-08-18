import { useEffect, useState } from '@lynx-js/react';
import {
  getDigestString,
  getGetRandomBytes,
  getRandomUUID,
} from '@lynxpo/mods-crypto';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches native crypto fields in a single synchronous pass over the bridge,
 * returning typed showcase rows. Faithful port of Expo's expo-crypto surface.
 */
export function useCryptoInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const sample = 'LynxPo 🔐';
      const sha256 = getDigestString('SHA256', sample, 'HEX') ?? '—';
      const md5 = getDigestString('MD5', sample, 'HEX') ?? '—';
      const random = getGetRandomBytes(16) ?? '—';
      const uuid = getRandomUUID() ?? '—';
      setRows([
        { label: 'SHA-256("LynxPo 🔐")', value: sha256 },
        { label: 'MD5("LynxPo 🔐")', value: md5 },
        { label: 'Random 16 bytes (b64)', value: random },
        { label: 'UUID v4', value: uuid },
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
