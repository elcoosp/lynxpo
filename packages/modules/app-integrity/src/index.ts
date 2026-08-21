// Auto-generated from AppIntegrity.kt
import { useEffect, useState } from '@lynx-js/react';
import { AppIntegrity } from './generated/AppIntegrity';

export const getIsAvailableAsync = (): boolean =>
  AppIntegrity.isAvailableAsync();

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

export const getIntegrityTokenAsync = (options: string): Record<string, any> =>
  NativeModules.AppIntegrity?.integrityTokenAsync?.(options);

export const useIntegrityTokenAsync = (options: string) => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIntegrityTokenAsync(options);
      setValue(result);
    };

    fetchData();
  }, [options]);

  return value;
};

export const getCodeHashAsync = (): Record<string, any> =>
  AppIntegrity.codeHashAsync();

export const useCodeHashAsync = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getCodeHashAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
