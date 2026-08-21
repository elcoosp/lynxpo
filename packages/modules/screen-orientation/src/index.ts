// Auto-generated from ScreenOrientationModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { ScreenOrientationModule } from './generated/ScreenOrientationModule';

export const getGetOrientation = (): number =>
  ScreenOrientationModule.getOrientation();

export const useGetOrientation = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetOrientation();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetOrientationLock = (): number =>
  ScreenOrientationModule.getOrientationLock();

export const useGetOrientationLock = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetOrientationLock();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSupportsOrientationLock = (): boolean =>
  ScreenOrientationModule.supportsOrientationLock();

export const useSupportsOrientationLock = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSupportsOrientationLock();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetOrientationAsync = (): Promise<number> =>
  ScreenOrientationModule.getOrientationAsync();

export const useGetOrientationAsync = () => {
  const [value, setValue] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetOrientationAsync();
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

export const getGetOrientationLockAsync = (): Promise<number> =>
  ScreenOrientationModule.getOrientationLockAsync();

export const useGetOrientationLockAsync = () => {
  const [value, setValue] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetOrientationLockAsync();
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

export const getLockAsync = (orientation: number): Promise<void> =>
  NativeModules.ScreenOrientationModule?.lockAsync?.(orientation);

export const useLockAsync = (orientation: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      await getLockAsync(orientation);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run };
};

export const getUnlockAsync = (): Promise<void> =>
  ScreenOrientationModule.unlockAsync();

export const useUnlockAsync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      await getUnlockAsync();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run };
};

export const getLockPlatformAsync = (orientation: number): Promise<void> =>
  NativeModules.ScreenOrientationModule?.lockPlatformAsync?.(orientation);

export const useLockPlatformAsync = (orientation: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      await getLockPlatformAsync(orientation);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run };
};

export const getSupportsOrientationLockAsync = (): Promise<boolean> =>
  ScreenOrientationModule.supportsOrientationLockAsync();

export const useSupportsOrientationLockAsync = () => {
  const [value, setValue] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getSupportsOrientationLockAsync();
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

export const getAddListener = (eventName: string): void =>
  NativeModules.ScreenOrientationModule?.addListener?.(eventName);

export const useAddListener = (eventName: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getAddListener(eventName);
      setValue(result);
    };

    fetchData();
  }, [eventName]);

  return value;
};

export const getRemoveListeners = (count: number): void =>
  NativeModules.ScreenOrientationModule?.removeListeners?.(count);

export const useRemoveListeners = (count: number) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRemoveListeners(count);
      setValue(result);
    };

    fetchData();
  }, [count]);

  return value;
};
