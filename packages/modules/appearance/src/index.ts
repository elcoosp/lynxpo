// Auto-generated from Appearance.kt
// NOTE: There is no current `expo-appearance` package on Expo main (it was
// removed). This module is an intentionally-retained LynxPo original — kept
// because the capability (color-scheme/appearance observation) is still
// useful and has no upstream Expo module to port from.
import { useEffect, useState } from '@lynx-js/react';
import { Appearance } from './generated/Appearance';

export const getGetColorScheme = (): string => Appearance?.getColorScheme?.();

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
  Appearance?.setColorScheme?.(scheme);

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
