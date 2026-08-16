// Auto-generated from ScreenOrientationModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface ScreenOrientationModule extends INativeModules {
  getOrientation(): number;
  getOrientationLock(): number;
  lock(): void;
  lockPlatform(): void;
  supportsOrientationLock(): boolean;
}

export const getGetOrientation = (): number =>
  NativeModules.ScreenOrientationModule?.getOrientation?.();

export const useGetOrientation = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetOrientation();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetOrientationLock = (): number =>
  NativeModules.ScreenOrientationModule?.getOrientationLock?.();

export const useGetOrientationLock = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetOrientationLock();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getLock = (): void =>
  NativeModules.ScreenOrientationModule?.lock?.();

export const useLock = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getLock();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getLockPlatform = (): void =>
  NativeModules.ScreenOrientationModule?.lockPlatform?.();

export const useLockPlatform = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getLockPlatform();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSupportsOrientationLock = (): boolean =>
  NativeModules.ScreenOrientationModule?.supportsOrientationLock?.();

export const useSupportsOrientationLock = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSupportsOrientationLock();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
