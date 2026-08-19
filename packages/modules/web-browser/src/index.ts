// Auto-generated from WebBrowserModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface WebBrowserModule extends INativeModules {
  isAvailable(): boolean;
  initialURL(): string;
}

export const getIsAvailable = (): boolean =>
  NativeModules.WebBrowserModule?.isAvailable?.();

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

export const getInitialURL = (): string =>
  NativeModules.WebBrowserModule?.initialURL?.();

export const useInitialURL = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getInitialURL();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
