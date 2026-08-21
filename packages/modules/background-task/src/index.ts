// Auto-generated from BackgroundTask.kt
import { useEffect, useState } from '@lynx-js/react';
import { BackgroundTask } from './generated/BackgroundTask';

export const getIsAvailableAsync = (): boolean =>
  BackgroundTask.isAvailableAsync();

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

export const getRegisterTaskAsync = (
  taskName: string,
  options: string,
): boolean =>
  NativeModules.BackgroundTask?.registerTaskAsync?.(taskName, options);

export const useRegisterTaskAsync = (taskName: string, options: string) => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRegisterTaskAsync(taskName, options);
      setValue(result);
    };

    fetchData();
  }, [taskName, options]);

  return value;
};

export const getUnregisterTaskAsync = (taskName: string): boolean =>
  NativeModules.BackgroundTask?.unregisterTaskAsync?.(taskName);

export const useUnregisterTaskAsync = (taskName: string) => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getUnregisterTaskAsync(taskName);
      setValue(result);
    };

    fetchData();
  }, [taskName]);

  return value;
};

export const getGetStatus = (): Record<string, any> =>
  BackgroundTask.getStatus();

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
