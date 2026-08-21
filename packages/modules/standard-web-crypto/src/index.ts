// Auto-generated from StandardWebCrypto.kt
import { useEffect, useState } from '@lynx-js/react';
import { StandardWebCrypto } from './generated/StandardWebCrypto';

export const getIsAvailableAsync = (): boolean =>
  StandardWebCrypto.isAvailableAsync();

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

export const getRandomBytesAsync = (length: string): string =>
  NativeModules.StandardWebCrypto?.randomBytesAsync?.(length);

export const useRandomBytesAsync = (length: string) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRandomBytesAsync(length);
      setValue(result);
    };

    fetchData();
  }, [length]);

  return value;
};

export const getDigestAsync = (algorithm: string, data: string): string =>
  NativeModules.StandardWebCrypto?.digestAsync?.(algorithm, data);

export const useDigestAsync = (algorithm: string, data: string) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getDigestAsync(algorithm, data);
      setValue(result);
    };

    fetchData();
  }, [algorithm, data]);

  return value;
};
