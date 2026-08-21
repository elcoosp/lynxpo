// Auto-generated from TrackingTransparency.kt
import { useEffect, useState } from '@lynx-js/react';
import { TrackingTransparency } from './generated/TrackingTransparency';

export const getGetAuthorizationStatus = (): string =>
  TrackingTransparency.getAuthorizationStatus();

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
  TrackingTransparency.requestAuthorization();

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
