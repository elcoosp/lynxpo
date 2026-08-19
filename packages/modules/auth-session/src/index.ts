// Auto-generated from AuthSession.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface AuthSession extends INativeModules {
  isAvailableAsync(): boolean;
  redirectUriAsync(): string;
  providerInfoAsync(): Record<string, any>;
}

export const getIsAvailableAsync = (): boolean =>
  NativeModules.AuthSession?.isAvailableAsync?.();

export const useIsAvailableAsync = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsAvailableAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getRedirectUriAsync = (): string =>
  NativeModules.AuthSession?.redirectUriAsync?.();

export const useRedirectUriAsync = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRedirectUriAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getProviderInfoAsync = (): Record<string, any> =>
  NativeModules.AuthSession?.providerInfoAsync?.();

export const useProviderInfoAsync = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getProviderInfoAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
