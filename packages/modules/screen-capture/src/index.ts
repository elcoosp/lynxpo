// Auto-generated from ScreenCapture.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface ScreenCapture extends INativeModules {
  isAvailableAsync(): boolean;
  preventScreenCapture(): boolean;
  allowScreenCapture(): boolean;
  permissionsAsync(): Record<string, any>;
  requestPermissionsAsync(): Record<string, any>;
}

export const getIsAvailableAsync = (): boolean =>
  NativeModules.ScreenCapture?.isAvailableAsync?.();

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

export const getPreventScreenCapture = (): boolean =>
  NativeModules.ScreenCapture?.preventScreenCapture?.();

export const usePreventScreenCapture = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getPreventScreenCapture();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getAllowScreenCapture = (): boolean =>
  NativeModules.ScreenCapture?.allowScreenCapture?.();

export const useAllowScreenCapture = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getAllowScreenCapture();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getPermissionsAsync = (): Record<string, any> =>
  NativeModules.ScreenCapture?.permissionsAsync?.();

export const usePermissionsAsync = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getPermissionsAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getRequestPermissionsAsync = (): Record<string, any> =>
  NativeModules.ScreenCapture?.requestPermissionsAsync?.();

export const useRequestPermissionsAsync = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRequestPermissionsAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
