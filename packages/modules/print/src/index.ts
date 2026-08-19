// Auto-generated from Print.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface Print extends INativeModules {
  printAsync(uri: string): void;
  selectPrinter(): Record<string, any>;
  isAvailable(): boolean;
}

export const getPrintAsync = (uri: string): void =>
  NativeModules.Print?.printAsync?.(uri);

export const usePrintAsync = (uri: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getPrintAsync(uri);
      setValue(result);
    };

    fetchData();
  }, [uri]);

  return value;
};

export const getSelectPrinter = (): Record<string, any> =>
  NativeModules.Print?.selectPrinter?.();

export const useSelectPrinter = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSelectPrinter();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getIsAvailable = (): boolean =>
  NativeModules.Print?.isAvailable?.();

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
