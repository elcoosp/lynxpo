// Auto-generated from Appearance.kt
import { useEffect, useState } from '@lynx-js/react';
import { Appearance } from './generated/Appearance';

export const getGetColorScheme = (): string =>
  Appearance.getColorScheme();

export const useGetColorScheme = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetColorScheme();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSetColorScheme = (scheme: string): void =>
  NativeModules.Appearance?.setColorScheme?.(scheme);

export const useSetColorScheme = (scheme: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetColorScheme(scheme);
      setValue(result);
    };

    fetchData();
  }, [scheme]);

  return value;
};
