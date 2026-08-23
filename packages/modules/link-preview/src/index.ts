// Auto-generated from LinkPreviewModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { NativeModules as INativeModules } from '@lynx-js/types';

export const getGenerateLinkPreviewAsync = (...args: any[]): Promise<any> =>
  NativeModules.LinkPreviewModule?.generateLinkPreviewAsync?.(...args);

export const useGenerateLinkPreviewAsync = (...args: any[]) => {
  const [value, setValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getGenerateLinkPreviewAsync(...args);
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted)
          setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};
