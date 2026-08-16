// Auto-generated from KeepAwakeModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface KeepAwakeModule extends INativeModules {
  activate(): void;
  deactivate(): void;
  isActivated(): boolean;
}

export const getActivate = (): void =>
  NativeModules.KeepAwakeModule?.activate?.();

export const useActivate = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getActivate();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getDeactivate = (): void =>
  NativeModules.KeepAwakeModule?.deactivate?.();

export const useDeactivate = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getDeactivate();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getIsActivated = (): boolean =>
  NativeModules.KeepAwakeModule?.isActivated?.();

export const useIsActivated = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsActivated();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
