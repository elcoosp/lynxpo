// Auto-generated from BrightnessModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { BrightnessModule } from './generated/BrightnessModule';

export const getGetBrightness = (): number =>
  BrightnessModule.getBrightness();

export const useGetBrightness = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetBrightness();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetSystemBrightness = (): number =>
  BrightnessModule.getSystemBrightness();

export const useGetSystemBrightness = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetSystemBrightness();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getIsUsingSystemBrightness = (): boolean =>
  BrightnessModule.isUsingSystemBrightness();

export const useIsUsingSystemBrightness = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsUsingSystemBrightness();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetSystemBrightnessMode = (): number =>
  BrightnessModule.getSystemBrightnessMode();

export const useGetSystemBrightnessMode = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetSystemBrightnessMode();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetBrightnessAsync = (): Promise<string> =>
  BrightnessModule.getBrightnessAsync();

export const useGetBrightnessAsync = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetBrightnessAsync();
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

export const getSetBrightnessAsync = (value: number): Promise<void> =>
  NativeModules.BrightnessModule?.setBrightnessAsync?.(value);

export const useSetBrightnessAsync = (value: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      await getSetBrightnessAsync(value);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run };
};

export const getGetSystemBrightnessAsync = (): Promise<string> =>
  BrightnessModule.getSystemBrightnessAsync();

export const useGetSystemBrightnessAsync = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetSystemBrightnessAsync();
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

export const getIsUsingSystemBrightnessAsync = (): Promise<boolean> =>
  BrightnessModule.isUsingSystemBrightnessAsync();

export const useIsUsingSystemBrightnessAsync = () => {
  const [value, setValue] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getIsUsingSystemBrightnessAsync();
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

export const getGetSystemBrightnessModeAsync = (): Promise<number> =>
  BrightnessModule.getSystemBrightnessModeAsync();

export const useGetSystemBrightnessModeAsync = () => {
  const [value, setValue] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetSystemBrightnessModeAsync();
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
  NativeModules.BrightnessModule?.addListener?.(eventName);

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
  NativeModules.BrightnessModule?.removeListeners?.(count);

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
