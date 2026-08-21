// Auto-generated from BackgroundFetch.kt
import { useEffect, useState } from '@lynx-js/react';
import { BackgroundFetch } from './generated/BackgroundFetch';

export const getGetStatus = (): Record<string, any> =>
  BackgroundFetch.getStatus();

export const useGetStatus = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetStatus();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getRegisterTaskAsync = (taskName: string): void =>
  NativeModules.BackgroundFetch?.registerTaskAsync?.(taskName);

export const useRegisterTaskAsync = (taskName: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRegisterTaskAsync(taskName);
      setValue(result);
    };

    fetchData();
  }, [taskName]);

  return value;
};

export const getUnregisterTaskAsync = (taskName: string): void =>
  NativeModules.BackgroundFetch?.unregisterTaskAsync?.(taskName);

export const useUnregisterTaskAsync = (taskName: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getUnregisterTaskAsync(taskName);
      setValue(result);
    };

    fetchData();
  }, [taskName]);

  return value;
};
