// Auto-generated from NetworkModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface NetworkModule extends INativeModules {
  getIpAddress(): string | null;
  getNetworkState(): Record<string, any | null>;
}

export const getGetIpAddress = (): string | null =>
  NativeModules.NetworkModule?.getIpAddress?.();

export const useGetIpAddress = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetIpAddress();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetNetworkState = (): Record<string, any | null> =>
  NativeModules.NetworkModule?.getNetworkState?.();

export const useGetNetworkState = () => {
  const [value, setValue] = useState<Record<string, any | null>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetNetworkState();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
