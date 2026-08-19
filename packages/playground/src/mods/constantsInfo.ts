import { useEffect, useState } from '@lynx-js/react';
import {
  getAppOwnership,
  getExecutionEnvironment,
  getInstallationId,
  getIsHeadless,
  getPlatform,
  getSessionId,
  getSystemFonts,
  getVersion,
} from '@lynxpo/mods-constants';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches native constants in a single synchronous pass over the bridge, returning
 * typed showcase rows. Faithful port of Expo's expo-constants native surface.
 */
export function useConstantsInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const appOwnership = getAppOwnership();
      const platform = getPlatform();
      const execEnv = getExecutionEnvironment();
      const sessionId = getSessionId();
      const installationId = getInstallationId();
      const isHeadless = getIsHeadless();
      const systemFonts = getSystemFonts();
      const version = getVersion();

      const fontCount = Array.isArray(systemFonts) ? systemFonts.length : 0;
      const buildVersion =
        version &&
        typeof version === 'object' &&
        'nativeBuildVersion' in version
          ? String(
              (version as Record<string, unknown>).nativeBuildVersion ?? '',
            )
          : '';

      setRows([
        { label: 'App ownership', value: appOwnership },
        { label: 'Platform', value: platform },
        { label: 'Execution env', value: execEnv },
        {
          label: 'Session id',
          value: sessionId ? `${sessionId.slice(0, 8)}…` : '—',
        },
        {
          label: 'Installation id',
          value: installationId ? `${installationId.slice(0, 8)}…` : '—',
        },
        { label: 'Headless', value: isHeadless ? 'Yes' : 'No' },
        { label: 'System fonts', value: `${fontCount} families` },
        { label: 'Native build', value: buildVersion || '—' },
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
