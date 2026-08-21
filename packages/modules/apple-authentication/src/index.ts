// Auto-generated from AppleAuthentication.kt
import { useEffect, useState } from '@lynx-js/react';
import { AppleAuthentication } from './generated/AppleAuthentication';

export const getIsAvailableAsync = (): boolean =>
  AppleAuthentication.isAvailableAsync();

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

export const getCredentialAsync = (options: string): Record<string, any> =>
  NativeModules.AppleAuthentication?.credentialAsync?.(options);

export const useCredentialAsync = (options: string) => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getCredentialAsync(options);
      setValue(result);
    };

    fetchData();
  }, [options]);

  return value;
};

export const getCredentialStateAsync = (user: string): string =>
  NativeModules.AppleAuthentication?.credentialStateAsync?.(user);

export const useCredentialStateAsync = (user: string) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getCredentialStateAsync(user);
      setValue(result);
    };

    fetchData();
  }, [user]);

  return value;
};
