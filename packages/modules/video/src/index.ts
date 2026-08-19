// Auto-generated from Video.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface Video extends INativeModules {
  getStatus(): Record<string, any>;
  play(): void;
  pause(): void;
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
}

export const getGetStatus = (): Record<string, any> =>
  NativeModules.Video?.getStatus?.();

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

export const getPlay = (): void => NativeModules.Video?.play?.();

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

export const getPause = (): void => NativeModules.Video?.pause?.();

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
  NativeModules.Video?.setVolume?.(volume);

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

export const getSetMuted = (muted: boolean): void =>
  NativeModules.Video?.setMuted?.(muted);

export const useSetMuted = (muted: boolean) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetMuted(muted);
      setValue(result);
    };

    fetchData();
  }, [muted]);

  return value;
};
