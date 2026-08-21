// Auto-generated from StatusBar.kt
import { useEffect, useState } from '@lynx-js/react';
import { StatusBar } from './generated/StatusBar';

export const getSetStyle = (style: string): void =>
  NativeModules.StatusBar?.setStyle?.(style);

export const useSetStyle = (style: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetStyle(style);
      setValue(result);
    };

    fetchData();
  }, [style]);

  return value;
};

export const getSetHidden = (hidden: boolean): void =>
  NativeModules.StatusBar?.setHidden?.(hidden);

export const useSetHidden = (hidden: boolean) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetHidden(hidden);
      setValue(result);
    };

    fetchData();
  }, [hidden]);

  return value;
};

export const getSetNetworkActivityIndicatorVisible = (visible: boolean): void =>
  NativeModules.StatusBar?.setNetworkActivityIndicatorVisible?.(visible);

export const useSetNetworkActivityIndicatorVisible = (visible: boolean) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetNetworkActivityIndicatorVisible(visible);
      setValue(result);
    };

    fetchData();
  }, [visible]);

  return value;
};

export const getSetBackgroundColor = (color: string): void =>
  NativeModules.StatusBar?.setBackgroundColor?.(color);

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
