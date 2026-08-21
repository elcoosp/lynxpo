// Auto-generated from NetworkAddons.kt
import { useEffect, useState } from '@lynx-js/react';
import { NetworkAddons } from './generated/NetworkAddons';

export const getIsAvailableAsync = (): boolean =>
  NetworkAddons.isAvailableAsync();

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

export const getCertificateInfoAsync = (host: string): Record<string, any> =>
  NativeModules.NetworkAddons?.certificateInfoAsync?.(host);

export const useCertificateInfoAsync = (host: string) => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getCertificateInfoAsync(host);
      setValue(result);
    };

    fetchData();
  }, [host]);

  return value;
};

export const getAddInterceptorAsync = (name: string): boolean =>
  NativeModules.NetworkAddons?.addInterceptorAsync?.(name);

export const useAddInterceptorAsync = (name: string) => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getAddInterceptorAsync(name);
      setValue(result);
    };

    fetchData();
  }, [name]);

  return value;
};
