// Auto-generated from WebBrowserModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { WebBrowserModule } from './generated/WebBrowserModule';

export const getIsAvailable = (): boolean =>
  WebBrowserModule.isAvailable();

export const useIsAvailable = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsAvailable();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getInitialURL = (): string =>
  WebBrowserModule.initialURL();

export const useInitialURL = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getInitialURL();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
