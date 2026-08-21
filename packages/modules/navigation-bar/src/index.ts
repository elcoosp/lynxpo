// Auto-generated from NavigationBar.kt
import { useEffect, useState } from '@lynx-js/react';
import { NavigationBar } from './generated/NavigationBar';

export const getSetBackgroundColor = (color: string): void =>
  NativeModules.NavigationBar?.setBackgroundColor?.(color);

export const useSetBackgroundColor = (color: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetBackgroundColor(color);
      setValue(result);
    };

    fetchData();
  }, [color]);

  return value;
};

export const getSetButtonStyle = (style: string): void =>
  NativeModules.NavigationBar?.setButtonStyle?.(style);

export const useSetButtonStyle = (style: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetButtonStyle(style);
      setValue(result);
    };

    fetchData();
  }, [style]);

  return value;
};

export const getSetVisibility = (visible: boolean): void =>
  NativeModules.NavigationBar?.setVisibility?.(visible);

export const useSetVisibility = (visible: boolean) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetVisibility(visible);
      setValue(result);
    };

    fetchData();
  }, [visible]);

  return value;
};

export const getGetVisibility = (): Record<string, any> =>
  NavigationBar.getVisibility();

export const useGetVisibility = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetVisibility();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
