// Auto-generated from VideoThumbnails.kt
import { useEffect, useState } from '@lynx-js/react';
import { VideoThumbnails } from './generated/VideoThumbnails';

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
  VideoThumbnails.isAvailableAsync();

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
