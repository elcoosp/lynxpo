// Auto-generated from NetworkModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { NetworkModule } from './generated/NetworkModule';

export const getGetIpAddress = (): string | null =>
  NetworkModule.getIpAddress();

export const useGetIpAddress = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetIpAddress();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetNetworkState = (): Record<string, any> =>
  NetworkModule.getNetworkState();

export const useGetNetworkState = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetNetworkState();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetIpAddressAsync = (): Promise<string> =>
  NetworkModule.getIpAddressAsync();

export const useGetIpAddressAsync = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetIpAddressAsync();
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

export const getGetNetworkStateAsync = (): Promise<any> =>
  NetworkModule.getNetworkStateAsync();

export const useGetNetworkStateAsync = () => {
  const [value, setValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetNetworkStateAsync();
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
  NativeModules.NetworkModule?.addListener?.(eventName);

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
  NativeModules.NetworkModule?.removeListeners?.(count);

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
