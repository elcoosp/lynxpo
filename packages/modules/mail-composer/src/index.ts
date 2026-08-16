// Auto-generated from MailComposerModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface MailComposerModule extends INativeModules {
  isAvailable(): boolean;
  getClients(): string[];
  compose(): void;
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

export const getCompose = (): void =>
  NativeModules.MailComposerModule?.compose?.();

export const useCompose = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getCompose();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
