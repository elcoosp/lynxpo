// Auto-generated from UpdatesModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { NativeModules as INativeModules } from '@lynx-js/types';

export const getGetNativeStateAsync = (): any =>
  NativeModules.UpdatesModule?.getNativeStateAsync?.();

export const useGetNativeStateAsync = () => {
  const [value, setValue] = useState<any>();
  useEffect(() => {
    const fetchData = () => {
      const result = getGetNativeStateAsync();
      setValue(result);
    };
    fetchData();
  }, []);
  return value;
};
export const getCheckForUpdateAsync = (...args: any[]): Promise<any> =>
  NativeModules.UpdatesModule?.checkForUpdateAsync?.(...args);

export const useCheckForUpdateAsync = (...args: any[]) => {
  const [value, setValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getCheckForUpdateAsync(...args);
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
export const getFetchUpdateAsync = (...args: any[]): Promise<any> =>
  NativeModules.UpdatesModule?.fetchUpdateAsync?.(...args);

export const useFetchUpdateAsync = (...args: any[]) => {
  const [value, setValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getFetchUpdateAsync(...args);
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
export const getIsUpdateAvailableAsync = (): any =>
  NativeModules.UpdatesModule?.isUpdateAvailableAsync?.();

export const useIsUpdateAvailableAsync = () => {
  const [value, setValue] = useState<any>();
  useEffect(() => {
    const fetchData = () => {
      const result = getIsUpdateAvailableAsync();
      setValue(result);
    };
    fetchData();
  }, []);
  return value;
};
export const getReloadAsync = (...args: any[]): Promise<any> =>
  NativeModules.UpdatesModule?.reloadAsync?.(...args);

export const useReloadAsync = (...args: any[]) => {
  const [value, setValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getReloadAsync(...args);
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
