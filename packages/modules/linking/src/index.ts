// Auto-generated from Linking.kt
import { useEffect, useState } from '@lynx-js/react';
import { Linking } from './generated/Linking';

export const getGetInitialURL = (): string => Linking.getInitialURL();

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
