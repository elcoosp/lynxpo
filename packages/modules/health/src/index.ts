// Auto-generated from Health.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface Health extends INativeModules {
  isAvailableAsync(): boolean;
  permissionsAsync(): Record<string, any>;
  requestPermissionsAsync(permissions: string): Record<string, any>;
  recordsAsync(options: string): Record<string, any>;
  writeRecordsAsync(records: string): Record<string, any>;
}

export const getIsAvailableAsync = (): boolean =>
  NativeModules.Health?.isAvailableAsync?.();

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

export const getPermissionsAsync = (): Record<string, any> =>
  NativeModules.Health?.permissionsAsync?.();

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

export const getRequestPermissionsAsync = (
  permissions: string,
): Record<string, any> =>
  NativeModules.Health?.requestPermissionsAsync?.(permissions);

export const useRequestPermissionsAsync = (permissions: string) => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRequestPermissionsAsync(permissions);
      setValue(result);
    };

    fetchData();
  }, [permissions]);

  return value;
};

export const getRecordsAsync = (options: string): Record<string, any> =>
  NativeModules.Health?.recordsAsync?.(options);

export const useRecordsAsync = (options: string) => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRecordsAsync(options);
      setValue(result);
    };

    fetchData();
  }, [options]);

  return value;
};

export const getWriteRecordsAsync = (records: string): Record<string, any> =>
  NativeModules.Health?.writeRecordsAsync?.(records);

export const useWriteRecordsAsync = (records: string) => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getWriteRecordsAsync(records);
      setValue(result);
    };

    fetchData();
  }, [records]);

  return value;
};
