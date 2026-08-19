// Auto-generated from Audio.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface Audio extends INativeModules {
  getStatus(): Record<string, any>;
  play(): void;
  pause(): void;
  setVolume(volume: number): void;
  setIsLooping(looping: boolean): void;
}

export const getGetStatus = (): Record<string, any> =>
  NativeModules.Audio?.getStatus?.();

export const useGetStatus = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetStatus();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getPlay = (): void => NativeModules.Audio?.play?.();

export const usePlay = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getPlay();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getPause = (): void => NativeModules.Audio?.pause?.();

export const usePause = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getPause();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSetVolume = (volume: number): void =>
  NativeModules.Audio?.setVolume?.(volume);

export const useSetVolume = (volume: number) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetVolume(volume);
      setValue(result);
    };

    fetchData();
  }, [volume]);

  return value;
};

export const getSetIsLooping = (looping: boolean): void =>
  NativeModules.Audio?.setIsLooping?.(looping);

export const useSetIsLooping = (looping: boolean) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetIsLooping(looping);
      setValue(result);
    };

    fetchData();
  }, [looping]);

  return value;
};
