// Auto-generated from VideoThumbnails.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface VideoThumbnails extends INativeModules {
  thumbnailAsync(source: string, options: string): Record<string, any>;
  isAvailableAsync(): boolean;
}

export const getThumbnailAsync = (
  source: string,
  options: string,
): Record<string, any> =>
  NativeModules.VideoThumbnails?.thumbnailAsync?.(source, options);

export const useThumbnailAsync = (source: string, options: string) => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getThumbnailAsync(source, options);
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
