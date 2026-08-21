// Auto-generated from SplashScreenModule.kt
import { useEffect, useState } from "@lynx-js/react";
import { NativeModules as INativeModules } from "@lynx-js/types";



export interface SplashScreenModule extends INativeModules {
  hideAsync(): string;
  preventAutoHideAsync(): string | null;
  statusAsync(): string;
};

export const getHideAsync = (): string =>
  NativeModules.SplashScreenModule?.hideAsync?.();

export const useHideAsync = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getHideAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getPreventAutoHideAsync = (): string | null =>
  NativeModules.SplashScreenModule?.preventAutoHideAsync?.();

export const usePreventAutoHideAsync = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getPreventAutoHideAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getStatusAsync = (): string =>
  NativeModules.SplashScreenModule?.statusAsync?.();

export const useStatusAsync = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getStatusAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
