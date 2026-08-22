// Auto-generated from CryptoModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { CryptoModule } from './generated/CryptoModule';

export const getDigestString = (
  algorithm: string,
  data: string,
  encoding: string,
): string | null =>
  NativeModules.CryptoModule?.digestString?.(algorithm, data, encoding);

export const useDigestString = (
  algorithm: string,
  data: string,
  encoding: string,
) => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getDigestString(algorithm, data, encoding);
      setValue(result);
    };

    fetchData();
  }, [algorithm, data, encoding]);

  return value;
};

export const getGetRandomBytes = (byteCount: number): string | null =>
  NativeModules.CryptoModule?.getRandomBytes?.(byteCount);

export const useGetRandomBytes = (byteCount: number) => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetRandomBytes(byteCount);
      setValue(result);
    };

    fetchData();
  }, [byteCount]);

  return value;
};

export const getRandomUUID = (): string | null => CryptoModule.randomUUID();

export const useRandomUUID = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRandomUUID();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getDigestStringAsync = (
  algorithm: string,
  data: string,
  encoding: string,
): Promise<string> =>
  NativeModules.CryptoModule?.digestStringAsync?.(algorithm, data, encoding);

export const useDigestStringAsync = (
  algorithm: string,
  data: string,
  encoding: string,
) => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getDigestStringAsync(algorithm, data, encoding);
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
  }, [algorithm, data, encoding]);

  return { value, loading, error };
};

export const getGetRandomBytesAsync = (byteCount: number): Promise<string> =>
  NativeModules.CryptoModule?.getRandomBytesAsync?.(byteCount);

export const useGetRandomBytesAsync = (byteCount: number) => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetRandomBytesAsync(byteCount);
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
  }, [byteCount]);

  return { value, loading, error };
};
