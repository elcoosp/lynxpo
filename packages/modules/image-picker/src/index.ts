// Auto-generated from ImagePickerModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface ImagePickerModule extends INativeModules {
  getCameraPermissions(): Record<string, any | null>;
  getMediaLibraryPermissions(): Record<string, any | null>;
}

export const getGetCameraPermissions = (): Record<string, any | null> =>
  NativeModules.ImagePickerModule?.getCameraPermissions?.();

export const useGetCameraPermissions = () => {
  const [value, setValue] = useState<Record<string, any | null>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetCameraPermissions();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetMediaLibraryPermissions = (): Record<string, any | null> =>
  NativeModules.ImagePickerModule?.getMediaLibraryPermissions?.();

export const useGetMediaLibraryPermissions = () => {
  const [value, setValue] = useState<Record<string, any | null>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetMediaLibraryPermissions();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
