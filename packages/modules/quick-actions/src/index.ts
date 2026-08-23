// Auto-generated from QuickActionsModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { NativeModules as INativeModules } from '@lynx-js/types';

export const getGetShortcutItemsAsync = (...args: any[]): Promise<any> =>
  NativeModules.QuickActionsModule?.getShortcutItemsAsync?.(...args);

export const useGetShortcutItemsAsync = (...args: any[]) => {
  const [value, setValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getGetShortcutItemsAsync(...args);
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
export const getSetShortcutItemsAsync = (...args: any[]): Promise<any> =>
  NativeModules.QuickActionsModule?.setShortcutItemsAsync?.(...args);

export const useSetShortcutItemsAsync = (...args: any[]) => {
  const [value, setValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getSetShortcutItemsAsync(...args);
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
export const getClearShortcutItemsAsync = (): any =>
  NativeModules.QuickActionsModule?.clearShortcutItemsAsync?.();

export const useClearShortcutItemsAsync = () => {
  const [value, setValue] = useState<any>();
  useEffect(() => {
    const fetchData = () => {
      const result = getClearShortcutItemsAsync();
      setValue(result);
    };
    fetchData();
  }, []);
  return value;
};
export const getInitialActionAsync = (...args: any[]): Promise<any> =>
  NativeModules.QuickActionsModule?.initialActionAsync?.(...args);

export const useInitialActionAsync = (...args: any[]) => {
  const [value, setValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getInitialActionAsync(...args);
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
