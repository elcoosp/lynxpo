// Auto-generated from AuthSession.kt
import { useEffect, useState } from '@lynx-js/react';
import { AuthSession } from './generated/AuthSession';

export const getIsAvailableAsync = (): boolean =>
  AuthSession.isAvailableAsync();

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
  AuthSession.redirectUriAsync();

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
  AuthSession.providerInfoAsync();

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
