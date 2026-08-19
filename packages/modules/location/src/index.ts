// Auto-generated from LocationModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface LocationModule extends INativeModules {
  providerStatus(): Record<string, boolean>;
  permissionsAsync(): Record<string, any>;
  requestPermission(): void;
  currentPositionAsync(): Record<string, number>;
}

export const getProviderStatus = (): Record<string, boolean> =>
  NativeModules.LocationModule?.providerStatus?.();

export const useProviderStatus = () => {
  const [value, setValue] = useState<Record<string, boolean>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getProviderStatus();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getPermissionsAsync = (): Record<string, any> =>
  NativeModules.LocationModule?.permissionsAsync?.();

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

export const getRequestPermission = (): void =>
  NativeModules.LocationModule?.requestPermission?.();

export const useRequestPermission = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRequestPermission();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getCurrentPositionAsync = (): Record<string, number> =>
  NativeModules.LocationModule?.currentPositionAsync?.();

export const useCurrentPositionAsync = () => {
  const [value, setValue] = useState<Record<string, number>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getCurrentPositionAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
