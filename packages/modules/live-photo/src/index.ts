// Auto-generated from LivePhoto.kt
import { useEffect, useState } from '@lynx-js/react';
import { LivePhoto } from './generated/LivePhoto';

export const getIsAvailableAsync = (): boolean =>
  LivePhoto.isAvailableAsync();

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

export const getIsLivePhotoAsync = (path: string): boolean =>
  NativeModules.LivePhoto?.isLivePhotoAsync?.(path);

export const useIsLivePhotoAsync = (path: string) => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsLivePhotoAsync(path);
      setValue(result);
    };

    fetchData();
  }, [path]);

  return value;
};

export const getSaveLivePhotoAsync = (video: string, photo: string): boolean =>
  NativeModules.LivePhoto?.saveLivePhotoAsync?.(video, photo);

export const useSaveLivePhotoAsync = (video: string, photo: string) => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSaveLivePhotoAsync(video, photo);
      setValue(result);
    };

    fetchData();
  }, [video, photo]);

  return value;
};
