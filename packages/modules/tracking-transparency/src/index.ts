// Auto-generated from TrackingTransparency.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface TrackingTransparency extends INativeModules {
  getAuthorizationStatus(): string;
  requestAuthorization(): string;
}

export const getGetAuthorizationStatus = (): string =>
  NativeModules.TrackingTransparency?.getAuthorizationStatus?.();

export const useGetAuthorizationStatus = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetAuthorizationStatus();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getRequestAuthorization = (): string =>
  NativeModules.TrackingTransparency?.requestAuthorization?.();

export const useRequestAuthorization = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRequestAuthorization();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
