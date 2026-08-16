// Auto-generated from StoreReviewModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface StoreReviewModule extends INativeModules {
  isAvailable(): boolean;
  requestReview(): void;
}

export const getIsAvailable = (): boolean =>
  NativeModules.StoreReviewModule?.isAvailable?.();

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

export const getRequestReview = (): void =>
  NativeModules.StoreReviewModule?.requestReview?.();

export const useRequestReview = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRequestReview();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
