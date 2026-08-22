// Auto-generated facade for AppIntegrity (Lynx Autolink v2).
import { useEffect, useState } from '@lynx-js/react';
import { AppIntegrity } from './generated/AppIntegrity';

export const getIsAvailableAsync = (): boolean =>
  AppIntegrity.isAvailableAsync();

export const useIsAvailableAsync = () => {
  const [value, setValue] = useState<boolean>();
  useEffect(() => {
    setValue(getIsAvailableAsync());
  }, []);
  return value;
};

export const getIntegrityTokenAsync = (
  options: string,
): Promise<Record<string, any>> =>
  new Promise((resolve) => {
    AppIntegrity.integrityTokenAsync(options, (result: Record<string, any>) =>
      resolve(result),
    );
  });

export const useIntegrityTokenAsync = (options: string) => {
  const [value, setValue] = useState<Record<string, any>>();
  useEffect(() => {
    let alive = true;
    getIntegrityTokenAsync(options).then((result) => {
      if (alive) setValue(result);
    });
    return () => {
      alive = false;
    };
  }, [options]);
  return value;
};

export const getCodeHashAsync = (): Record<string, any> =>
  AppIntegrity.codeHashAsync();

export const useCodeHashAsync = () => {
  const [value, setValue] = useState<Record<string, any>>();
  useEffect(() => {
    setValue(getCodeHashAsync());
  }, []);
  return value;
};
