import { useEffect, useState } from '@lynx-js/react';
import { SecureStoreModule } from './generated/SecureStoreModule';

export const getIsAvailable = (): boolean | null =>
  SecureStoreModule.isAvailable() ?? null;

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

export const setItemAsync = (key: string, value: string): Promise<void> =>
  NativeModules.SecureStoreModule?.setItemAsync?.(key, value);

export const getItemAsync = (key: string): Promise<string | null> =>
  NativeModules.SecureStoreModule?.getItemAsync?.(key);

export const deleteItemAsync = (key: string): Promise<void> =>
  NativeModules.SecureStoreModule?.deleteItemAsync?.(key);

export const getIsAvailableAsync = (): Promise<boolean> =>
  SecureStoreModule.isAvailableAsync();
