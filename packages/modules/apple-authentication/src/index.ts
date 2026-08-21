// Auto-generated facade for AppleAuthentication (Lynx Autolink v2).
import { useEffect, useState } from '@lynx-js/react';
import { AppleAuthentication } from './generated/AppleAuthentication';

export const getIsAvailableAsync = (): boolean => AppleAuthentication.isAvailableAsync();

export const useIsAvailableAsync = () => {
  const [value, setValue] = useState<boolean>();
  useEffect(() => {
    setValue(getIsAvailableAsync());
  }, []);
  return value;
};

export const getCredentialAsync = (options: string): Promise<Record<string, any>> =>
  new Promise((resolve) => {
    AppleAuthentication.credentialAsync(options, (result: Record<string, any>) => resolve(result));
  });

export const useCredentialAsync = (options: string) => {
  const [value, setValue] = useState<Record<string, any>>();
  useEffect(() => {
    let alive = true;
    getCredentialAsync(options).then((result) => {
      if (alive) setValue(result);
    });
    return () => {
      alive = false;
    };
  }, [options]);
  return value;
};

export const getCredentialStateAsync = (user: string): Promise<string> =>
  new Promise((resolve) => {
    AppleAuthentication.credentialStateAsync(user, (result: string) => resolve(result));
  });

export const useCredentialStateAsync = (user: string) => {
  const [value, setValue] = useState<string>();
  useEffect(() => {
    let alive = true;
    getCredentialStateAsync(user).then((result) => {
      if (alive) setValue(result);
    });
    return () => {
      alive = false;
    };
  }, [user]);
  return value;
};
