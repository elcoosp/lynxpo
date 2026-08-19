// Auto-generated from IntentLauncher.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface IntentLauncher extends INativeModules {
  startActivity(activity: string, data: string): string;
  startActivityAsync(options: string): string;
  canOpenURL(url: string): boolean;
}

export const getStartActivity = (activity: string, data: string): string =>
  NativeModules.IntentLauncher?.startActivity?.(activity, data);

export const useStartActivity = (activity: string, data: string) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getStartActivity(activity, data);
      setValue(result);
    };

    fetchData();
  }, [activity, data]);

  return value;
};

export const getStartActivityAsync = (options: string): string =>
  NativeModules.IntentLauncher?.startActivityAsync?.(options);

export const useStartActivityAsync = (options: string) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getStartActivityAsync(options);
      setValue(result);
    };

    fetchData();
  }, [options]);

  return value;
};

export const getCanOpenURL = (url: string): boolean =>
  NativeModules.IntentLauncher?.canOpenURL?.(url);

export const useCanOpenURL = (url: string) => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getCanOpenURL(url);
      setValue(result);
    };

    fetchData();
  }, [url]);

  return value;
};
