// Auto-generated from VideoThumbnails.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface VideoThumbnails extends INativeModules {
  getThumbnailAsync(source: string, options: string): Record<string, any>;
  isAvailableAsync(): boolean;
}

export const getGetThumbnailAsync = (
  source: string,
  options: string,
): Record<string, any> =>
  NativeModules.VideoThumbnails?.getThumbnailAsync?.(source, options);

export const useGetThumbnailAsync = (source: string, options: string) => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetThumbnailAsync(source, options);
      setValue(result);
    };

    fetchData();
  }, [source, options]);

  return value;
};

export const getIsAvailableAsync = (): boolean =>
  NativeModules.VideoThumbnails?.isAvailableAsync?.();

export const useIsAvailableAsync = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsAvailableAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
