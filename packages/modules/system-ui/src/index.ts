// Auto-generated from SystemUi.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface SystemUi extends INativeModules {
  getBackgroundColor(): string;
  setBackgroundColor(color: string): void;
  setStatusBarBackgroundColor(color: string): void;
}

export const getGetBackgroundColor = (): string =>
  NativeModules.SystemUi?.getBackgroundColor?.();

export const useGetBackgroundColor = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetBackgroundColor();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSetBackgroundColor = (color: string): void =>
  NativeModules.SystemUi?.setBackgroundColor?.(color);

export const useSetBackgroundColor = (color: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetBackgroundColor(color);
      setValue(result);
    };

    fetchData();
  }, [color]);

  return value;
};

export const getSetStatusBarBackgroundColor = (color: string): void =>
  NativeModules.SystemUi?.setStatusBarBackgroundColor?.(color);

export const useSetStatusBarBackgroundColor = (color: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetStatusBarBackgroundColor(color);
      setValue(result);
    };

    fetchData();
  }, [color]);

  return value;
};
