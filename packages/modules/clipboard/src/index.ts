// Auto-generated from ClipboardModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { ClipboardModule } from './generated/ClipboardModule';

export const getGetString = (): string | null => ClipboardModule.getString();

export const useGetString = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetString();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getHasString = (): boolean => ClipboardModule.hasString();

export const useHasString = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getHasString();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetStringAsync = (): Promise<string> =>
  ClipboardModule.getStringAsync();

export const useGetStringAsync = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetStringAsync();
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

export const getSetStringAsync = (text: string): Promise<void> =>
  NativeModules.ClipboardModule?.setStringAsync?.(text);

export const useSetStringAsync = (text: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      await getSetStringAsync(text);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run };
};

export const getHasStringAsync = (): Promise<boolean> =>
  ClipboardModule.hasStringAsync();

export const useHasStringAsync = () => {
  const [value, setValue] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getHasStringAsync();
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
