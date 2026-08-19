// Auto-generated from DocumentPicker.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface DocumentPicker extends INativeModules {
  documentAsync(options: string): Record<string, any>;
  isAvailableAsync(): boolean;
}

export const getDocumentAsync = (options: string): Record<string, any> =>
  NativeModules.DocumentPicker?.documentAsync?.(options);

export const useDocumentAsync = (options: string) => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getDocumentAsync(options);
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
