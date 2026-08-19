// Auto-generated from Sharing.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface Sharing extends INativeModules {
  isAvailable(): boolean;
  shareAsync(url: string): void;
}

export const getIsAvailable = (): boolean =>
  NativeModules.Sharing?.isAvailable?.();

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

export const getShareAsync = (url: string): void =>
  NativeModules.Sharing?.shareAsync?.(url);

export const useShareAsync = (url: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getShareAsync(url);
      setValue(result);
    };

    fetchData();
  }, [url]);

  return value;
};
