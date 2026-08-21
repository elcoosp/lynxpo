// Auto-generated from SplashScreenModule.kt
import { useEffect, useState } from "@lynx-js/react";
import { SplashScreenModule } from './generated/SplashScreenModule';



;

export const getHideAsync = (): string =>
  SplashScreenModule.hideAsync();

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
  SplashScreenModule.preventAutoHideAsync();

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
  SplashScreenModule.statusAsync();

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
