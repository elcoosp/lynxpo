// Auto-generated from LocalAuthenticationModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface LocalAuthenticationModule extends INativeModules {
  hasHardware(): boolean;
  isEnrolled(): boolean;
  getEnrolledLevel(): string | null;
  supportedAuthenticationTypes(): string | null;
  hasHardwareAsync(): Promise<boolean>;
  isEnrolledAsync(): Promise<boolean>;
  getEnrolledLevelAsync(): Promise<string>;
  supportedAuthenticationTypesAsync(): Promise<string>;
  authenticateAsync(prompt: string): Promise<Record<string, any>>;
}

export const getHasHardware = (): boolean =>
  NativeModules.LocalAuthenticationModule?.hasHardware?.() ?? false;

export const useHasHardware = () => {
  const [value, setValue] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = () => {
      setValue(getHasHardware());
    };

    fetchData();
  }, []);

  return value;
};

export const getIsEnrolled = (): boolean =>
  NativeModules.LocalAuthenticationModule?.isEnrolled?.() ?? false;

export const useIsEnrolled = () => {
  const [value, setValue] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = () => {
      setValue(getIsEnrolled());
    };

    fetchData();
  }, []);

  return value;
};

export const getGetEnrolledLevel = (): string | null =>
  NativeModules.LocalAuthenticationModule?.getEnrolledLevel?.();

export const useGetEnrolledLevel = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetEnrolledLevel();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSupportedAuthenticationTypes = (): string | null =>
  NativeModules.LocalAuthenticationModule?.supportedAuthenticationTypes?.();

export const useSupportedAuthenticationTypes = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSupportedAuthenticationTypes();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getHasHardwareAsync = (): Promise<boolean> =>
  NativeModules.LocalAuthenticationModule?.hasHardwareAsync?.();

export const useHasHardwareAsync = () => {
  const [value, setValue] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getHasHardwareAsync();
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

export const getIsEnrolledAsync = (): Promise<boolean> =>
  NativeModules.LocalAuthenticationModule?.isEnrolledAsync?.();

export const useIsEnrolledAsync = () => {
  const [value, setValue] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getIsEnrolledAsync();
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

export const getGetEnrolledLevelAsync = (): Promise<string> =>
  NativeModules.LocalAuthenticationModule?.getEnrolledLevelAsync?.();

export const useGetEnrolledLevelAsync = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetEnrolledLevelAsync();
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

export const getSupportedAuthenticationTypesAsync = (): Promise<string> =>
  NativeModules.LocalAuthenticationModule?.supportedAuthenticationTypesAsync?.();

export const useSupportedAuthenticationTypesAsync = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getSupportedAuthenticationTypesAsync();
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

export const getAuthenticateAsync = (
  prompt: string,
): Promise<Record<string, any>> =>
  NativeModules.LocalAuthenticationModule?.authenticateAsync?.(prompt);

export const useAuthenticateAsync = (prompt: string) => {
  const [value, setValue] = useState<Record<string, any>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getAuthenticateAsync(prompt);
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
  }, [prompt]);

  return { value, loading, error };
};
