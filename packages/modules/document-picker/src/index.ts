// Auto-generated from DocumentPicker.kt
import { useEffect, useState } from '@lynx-js/react';
import { DocumentPicker } from './generated/DocumentPicker';

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
  DocumentPicker.isAvailableAsync();

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
