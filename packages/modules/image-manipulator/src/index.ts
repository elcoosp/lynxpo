// Auto-generated from ImageManipulator.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface ImageManipulator extends INativeModules {
  manipulateAsync(
    uri: string,
    actions: string,
    saveOptions: string,
  ): Record<string, any>;
  isAvailableAsync(uri: string): boolean;
}

export const getManipulateAsync = (
  uri: string,
  actions: string,
  saveOptions: string,
): Record<string, any> =>
  NativeModules.ImageManipulator?.manipulateAsync?.(uri, actions, saveOptions);

export const useManipulateAsync = (
  uri: string,
  actions: string,
  saveOptions: string,
) => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getManipulateAsync(uri, actions, saveOptions);
      setValue(result);
    };

    fetchData();
  }, [uri, actions, saveOptions]);

  return value;
};

export const getIsAvailableAsync = (uri: string): boolean =>
  NativeModules.ImageManipulator?.isAvailableAsync?.(uri);

export const useIsAvailableAsync = (uri: string) => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsAvailableAsync(uri);
      setValue(result);
    };

    fetchData();
  }, [uri]);

  return value;
};
