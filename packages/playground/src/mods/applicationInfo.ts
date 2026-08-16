import { useEffect, useState } from '@lynx-js/react';
import {
  getAndroidId,
  getApplicationId,
  getApplicationName,
  getGetInstallationTime,
  getGetLastUpdateTime,
  getNativeApplicationVersion,
  getNativeBuildVersion,
} from '@lynxpo/mods-application';

export interface ApplicationInfo {
  applicationName: string | undefined;
  applicationId: string | undefined;
  nativeApplicationVersion: string | undefined;
  nativeBuildVersion: string | undefined;
  androidId: string | undefined;
  installationTime: number | undefined;
  lastUpdateTime: number | undefined;
}

/**
 * Fetches all application fields in a single synchronous pass over the native
 * bridge. Returns a typed snapshot plus explicit loading/error state so an
 * absent module is never silently `undefined`. Faithful port of Expo's
 * `expo-application` (v57) native surface.
 */
export function useApplicationInfo(): {
  info: ApplicationInfo | null;
  loading: boolean;
  error: Error | null;
} {
  const [info, setInfo] = useState<ApplicationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setInfo({
        applicationName: getApplicationName(),
        applicationId: getApplicationId(),
        nativeApplicationVersion: getNativeApplicationVersion(),
        nativeBuildVersion: getNativeBuildVersion(),
        androidId: getAndroidId(),
        installationTime: getGetInstallationTime(),
        lastUpdateTime: getGetLastUpdateTime(),
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
