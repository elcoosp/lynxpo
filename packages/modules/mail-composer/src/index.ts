// Auto-generated from MailComposerModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface MailComposerModule extends INativeModules {
  isAvailable(): boolean;
  getClients(): string[];
  isAvailableAsync(): Promise<boolean>;
  getClientsAsync(): Promise<string[]>;
  composeAsync(
    subject: string,
    body: string,
    recipients: string[],
  ): Promise<void>;
}

export const getIsAvailable = (): boolean =>
  NativeModules.MailComposerModule?.isAvailable?.();

export const useIsAvailable = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsAvailable();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetClients = (): string[] =>
  NativeModules.MailComposerModule?.getClients?.();

export const useGetClients = () => {
  const [value, setValue] = useState<string[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetClients();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getIsAvailableAsync = (): Promise<boolean> =>
  NativeModules.MailComposerModule?.isAvailableAsync?.();

export const useIsAvailableAsync = () => {
  const [value, setValue] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getIsAvailableAsync();
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

export const getGetClientsAsync = (): Promise<string[]> =>
  NativeModules.MailComposerModule?.getClientsAsync?.();

export const useGetClientsAsync = () => {
  const [value, setValue] = useState<string[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetClientsAsync();
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

export const getComposeAsync = (
  subject: string,
  body: string,
  recipients: string[],
): Promise<void> =>
  NativeModules.MailComposerModule?.composeAsync?.(subject, body, recipients);

export const useComposeAsync = (
  subject: string,
  body: string,
  recipients: string[],
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      await getComposeAsync(subject, body, recipients);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run };
};
