// Auto-generated from MediaLibraryModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface MediaLibraryModule extends INativeModules {
  permissionsAsync(): Record<string, any>;
  requestPermission(): void;
  albumsAsync(): Record<string, any>[];
  assetsAsync(): Record<string, any>;
}

export const getPermissionsAsync = (): Record<string, any> =>
  NativeModules.MediaLibraryModule?.permissionsAsync?.();

export const usePermissionsAsync = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getPermissionsAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getRequestPermission = (): void =>
  NativeModules.MediaLibraryModule?.requestPermission?.();

export const useRequestPermission = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRequestPermission();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getAlbumsAsync = (): Record<string, any>[] =>
  NativeModules.MediaLibraryModule?.albumsAsync?.();

export const useAlbumsAsync = () => {
  const [value, setValue] = useState<Record<string, any>[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getAlbumsAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getAssetsAsync = (): Record<string, any> =>
  NativeModules.MediaLibraryModule?.assetsAsync?.();

export const useAssetsAsync = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getAssetsAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
