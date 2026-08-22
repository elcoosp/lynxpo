import { useEffect, useState } from '@lynx-js/react';
import { getHideAsync, getStatusAsync } from '@lynxpo/mods-splash-screen';

export interface SplashScreenInfo {
  status: string;
  hideResult: string;
}

export function useSplashScreenInfo() {
  const [info, setInfo] = useState<SplashScreenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getStatusAsync(), getHideAsync()])
      .then(([status, hideResult]) => {
        if (!cancelled) setInfo({ status, hideResult });
      })
      .catch((e) => {
        if (!cancelled) setError(e as Error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { info, loading, error };
}
