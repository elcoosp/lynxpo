// Auto-generated from LocationModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { LocationModule } from './generated/LocationModule';

export const getProviderStatus = (): Record<string, boolean> =>
  LocationModule.providerStatus();

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
  LocationModule.permissionsAsync();

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
  LocationModule.requestPermission();

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
  LocationModule.currentPositionAsync();

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
