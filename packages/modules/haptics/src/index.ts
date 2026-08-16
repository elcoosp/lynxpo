// Auto-generated from HapticsModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface HapticsModule extends INativeModules {
  impactAsync(): void;
  notificationAsync(): void;
  selectionAsync(): void;
}

export const getImpactAsync = (): void =>
  NativeModules.HapticsModule?.impactAsync?.();

export const useImpactAsync = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getImpactAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getNotificationAsync = (): void =>
  NativeModules.HapticsModule?.notificationAsync?.();

export const useNotificationAsync = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getNotificationAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSelectionAsync = (): void =>
  NativeModules.HapticsModule?.selectionAsync?.();

export const useSelectionAsync = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSelectionAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
