// Auto-generated from KeepAwakeModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface KeepAwakeModule extends INativeModules {
  isActivated(): boolean;
  activateAsync(): Promise<void>;
  deactivateAsync(): Promise<void>;
  isActivatedAsync(): Promise<boolean>;
}

export const getIsActivated = (): boolean =>
  NativeModules.KeepAwakeModule?.isActivated?.();

export const useIsActivated = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsActivated();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getActivateAsync = (): Promise<void> =>
  NativeModules.KeepAwakeModule?.activateAsync?.();

export const useActivateAsync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      await getActivateAsync();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run };
};

export const getDeactivateAsync = (): Promise<void> =>
  NativeModules.KeepAwakeModule?.deactivateAsync?.();

export const useDeactivateAsync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      await getDeactivateAsync();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run };
};

export const getIsActivatedAsync = (): Promise<boolean> =>
  NativeModules.KeepAwakeModule?.isActivatedAsync?.();

export const useIsActivatedAsync = () => {
  const [value, setValue] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getIsActivatedAsync();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { value, loading, error };
};
