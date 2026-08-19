// Auto-generated from Linking.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface Linking extends INativeModules {
  getInitialURL(): string;
  canOpenURL(url: string): boolean;
  openURL(url: string): void;
}

export const getGetInitialURL = (): string =>
  NativeModules.Linking?.getInitialURL?.();

export const useGetInitialURL = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetInitialURL();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getCanOpenURL = (url: string): boolean =>
  NativeModules.Linking?.canOpenURL?.(url);

export const useCanOpenURL = (url: string) => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getCanOpenURL(url);
      setValue(result);
    };

    fetchData();
  }, [url]);

  return value;
};

export const getOpenURL = (url: string): void =>
  NativeModules.Linking?.openURL?.(url);

export const useOpenURL = (url: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getOpenURL(url);
      setValue(result);
    };

    fetchData();
  }, [url]);

  return value;
};
