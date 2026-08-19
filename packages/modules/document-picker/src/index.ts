// Auto-generated from DocumentPicker.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface DocumentPicker extends INativeModules {
  getDocumentAsync(options: string): Record<string, any>;
  isAvailableAsync(): boolean;
}

export const getGetDocumentAsync = (options: string): Record<string, any> =>
  NativeModules.DocumentPicker?.getDocumentAsync?.(options);

export const useGetDocumentAsync = (options: string) => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetDocumentAsync(options);
      setValue(result);
    };

    fetchData();
  }, [options]);

  return value;
};

export const getIsAvailableAsync = (): boolean =>
  NativeModules.DocumentPicker?.isAvailableAsync?.();

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
