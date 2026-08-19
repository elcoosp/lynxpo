// Auto-generated from AppIntegrity.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface AppIntegrity extends INativeModules {
  isAvailableAsync(): boolean;
  integrityTokenAsync(options: string): Record<string, any>;
  codeHashAsync(): Record<string, any>;
}

export const getIsAvailableAsync = (): boolean =>
  NativeModules.AppIntegrity?.isAvailableAsync?.();

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
  NativeModules.AppIntegrity?.codeHashAsync?.();

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
