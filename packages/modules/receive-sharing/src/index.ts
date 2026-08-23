// Auto-generated from ReceiveSharingModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { NativeModules as INativeModules } from '@lynx-js/types';

export const getGetInitialIntentAsync = (...args: any[]): Promise<any> =>
  NativeModules.ReceiveSharingModule?.getInitialIntentAsync?.(...args);

export const useGetInitialIntentAsync = (...args: any[]) => {
  const [value, setValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getGetInitialIntentAsync(...args);
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
export const getHasIntentAsync = (): any =>
  NativeModules.ReceiveSharingModule?.hasIntentAsync?.();

export const useHasIntentAsync = () => {
  const [value, setValue] = useState<any>();
  useEffect(() => {
    const fetchData = () => {
      const result = getHasIntentAsync();
      setValue(result);
    };
    fetchData();
  }, []);
  return value;
};
export const getAddListener = (...args: any[]): Promise<any> =>
  NativeModules.ReceiveSharingModule?.addListener?.(...args);

export const useAddListener = (...args: any[]) => {
  const [value, setValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getAddListener(...args);
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
