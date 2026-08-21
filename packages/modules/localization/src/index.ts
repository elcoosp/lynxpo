// Auto-generated from LocalizationModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { LocalizationModule } from './generated/LocalizationModule';

export const getGetLocales = (): Record<string, any | null>[] =>
  LocalizationModule.getLocales();

export const useGetLocales = () => {
  const [value, setValue] = useState<Record<string, any | null>[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetLocales();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetCalendars = (): Record<string, any | null>[] =>
  LocalizationModule.getCalendars();

export const useGetCalendars = () => {
  const [value, setValue] = useState<Record<string, any | null>[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetCalendars();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
