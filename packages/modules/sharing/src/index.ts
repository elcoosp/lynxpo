// Auto-generated from Sharing.kt
import { useEffect, useState } from '@lynx-js/react';
import { Sharing } from './generated/Sharing';

export const getIsAvailable = (): boolean => Sharing.isAvailable();

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
