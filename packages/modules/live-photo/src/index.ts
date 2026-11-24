// Auto-generated from LivePhoto.kt
import { useEffect, useState } from '@lynx-js/react';
import { LivePhoto } from './generated/LivePhoto';

export const getIsAvailableAsync = (): Promise<boolean> =>
  LivePhoto.isAvailableAsync() as Promise<boolean>;

export const useIsAvailableAsync = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getIsAvailableAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getIsLivePhotoAsync = (path: string): Promise<boolean> =>
  NativeModules.LivePhoto?.isLivePhotoAsync?.(path) as Promise<boolean>;

export const useIsLivePhotoAsync = (path: string) => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getIsLivePhotoAsync(path);
      setValue(result);
    };

    fetchData();
  }, [path]);

  return value;
};

export const getSaveLivePhotoAsync = (
  video: string,
  photo: string,
): Promise<boolean> =>
  NativeModules.LivePhoto?.saveLivePhotoAsync?.(video, photo) as Promise<boolean>;

export const useSaveLivePhotoAsync = (video: string, photo: string) => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getSaveLivePhotoAsync(video, photo);
      setValue(result);
    };

    fetchData();
  }, [video, photo]);

  return value;
};
