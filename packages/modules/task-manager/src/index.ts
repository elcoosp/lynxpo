// Auto-generated from TaskManager.kt
import { useEffect, useState } from '@lynx-js/react';
import { TaskManager } from './generated/TaskManager';

export const getIsTaskRegistered = (taskName: string): boolean =>
  NativeModules.TaskManager?.isTaskRegistered?.(taskName);

export const useIsTaskRegistered = (taskName: string) => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsTaskRegistered(taskName);
      setValue(result);
    };

    fetchData();
  }, [taskName]);

  return value;
};

export const getGetRegisteredTasks = (): string[] =>
  TaskManager.getRegisteredTasks();

export const useGetRegisteredTasks = () => {
  const [value, setValue] = useState<string[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetRegisteredTasks();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getUnregisterTaskAsync = (taskName: string): void =>
  NativeModules.TaskManager?.unregisterTaskAsync?.(taskName);

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
