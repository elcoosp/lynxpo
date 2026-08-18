import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface SecureStoreModule extends INativeModules {
  isAvailable(): boolean;
  setItemAsync(key: string, value: string): Promise<void>;
  getItemAsync(key: string): Promise<string | null>;
  deleteItemAsync(key: string): Promise<void>;
  isAvailableAsync(): Promise<boolean>;
}

export const getIsAvailable = (): boolean | null =>
  NativeModules.SecureStoreModule?.isAvailable?.() ?? null;

export const useIsAvailable = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      setValue(getIsAvailable() ?? false);
    };

    fetchData();
  }, []);

  return value;
};

export const setItemAsync = (
  key: string,
  value: string,
): Promise<void> => NativeModules.SecureStoreModule?.setItemAsync?.(key, value);

export const getItemAsync = (key: string): Promise<string | null> =>
  NativeModules.SecureStoreModule?.getItemAsync?.(key);

export const deleteItemAsync = (key: string): Promise<void> =>
  NativeModules.SecureStoreModule?.deleteItemAsync?.(key);

export const getIsAvailableAsync = (): Promise<boolean> =>
  NativeModules.SecureStoreModule?.isAvailableAsync?.();
