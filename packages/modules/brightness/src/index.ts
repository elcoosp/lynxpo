// Auto-generated from BrightnessModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface BrightnessModule extends INativeModules {
  getBrightness(): number;
  setBrightness(): void;
  getSystemBrightness(): number;
  isUsingSystemBrightness(): boolean;
  getSystemBrightnessMode(): number;
}

export const getGetBrightness = (): number =>
  NativeModules.BrightnessModule?.getBrightness?.();

export const useGetBrightness = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetBrightness();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSetBrightness = (): void =>
  NativeModules.BrightnessModule?.setBrightness?.();

export const useSetBrightness = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetBrightness();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetSystemBrightness = (): number =>
  NativeModules.BrightnessModule?.getSystemBrightness?.();

export const useGetSystemBrightness = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetSystemBrightness();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getIsUsingSystemBrightness = (): boolean =>
  NativeModules.BrightnessModule?.isUsingSystemBrightness?.();

export const useIsUsingSystemBrightness = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsUsingSystemBrightness();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetSystemBrightnessMode = (): number =>
  NativeModules.BrightnessModule?.getSystemBrightnessMode?.();

export const useGetSystemBrightnessMode = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetSystemBrightnessMode();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
