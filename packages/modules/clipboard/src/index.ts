// Auto-generated from ClipboardModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface ClipboardModule extends INativeModules {
  getString(): string | null;
  setString(): void;
  hasString(): boolean;
}

export const getGetString = (): string | null =>
  NativeModules.ClipboardModule?.getString?.();

export const useGetString = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetString();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSetString = (): void =>
  NativeModules.ClipboardModule?.setString?.();

export const useSetString = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetString();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getHasString = (): boolean =>
  NativeModules.ClipboardModule?.hasString?.();

export const useHasString = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getHasString();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
