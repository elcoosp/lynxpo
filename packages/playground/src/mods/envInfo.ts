import { useEffect, useState } from '@lynx-js/react';
import {
  getEnvInfo,
  getInstallTime,
  getIsRunningOnDevice,
} from '@lynxpo/mods-env-info';

export interface EnvInfo {
  isRunningOnDevice: boolean | undefined;
  installTime: number | undefined;
  osName: string | undefined;
  osVersion: string | undefined;
  appVersion: string | undefined;
  appId: string | undefined;
}

/**
 * Fetches env-info fields in a single synchronous pass over the native
 * bridge. Returns a typed snapshot plus explicit loading/error state.
 */
export function useEnvInfo(): {
  info: EnvInfo | null;
  loading: boolean;
  error: Error | null;
} {
  const [info, setInfo] = useState<EnvInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const raw = getEnvInfo();
      setInfo({
        isRunningOnDevice: getIsRunningOnDevice(),
        installTime: getInstallTime(),
        osName: raw?.osName,
        osVersion: raw?.osVersion,
        appVersion: raw?.appVersion,
        appId: raw?.appId,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  return { info, loading, error };
}
