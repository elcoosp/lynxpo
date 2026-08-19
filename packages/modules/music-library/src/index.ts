// Auto-generated from MusicLibrary.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface MusicLibrary extends INativeModules {
  getAlbums(): Record<string, any>[];
  getSongs(albumId: string): Record<string, any>[];
  requestPermissions(): Record<string, any>;
  getPermissions(): Record<string, any>;
}

export const getGetAlbums = (): Record<string, any>[] =>
  NativeModules.MusicLibrary?.getAlbums?.();

export const useGetAlbums = () => {
  const [value, setValue] = useState<Record<string, any>[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetAlbums();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetSongs = (albumId: string): Record<string, any>[] =>
  NativeModules.MusicLibrary?.getSongs?.(albumId);

export const useGetSongs = (albumId: string) => {
  const [value, setValue] = useState<Record<string, any>[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetSongs(albumId);
      setValue(result);
    };

    fetchData();
  }, [albumId]);

  return value;
};

export const getRequestPermissions = (): Record<string, any> =>
  NativeModules.MusicLibrary?.requestPermissions?.();

export const useRequestPermissions = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRequestPermissions();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetPermissions = (): Record<string, any> =>
  NativeModules.MusicLibrary?.getPermissions?.();

export const useGetPermissions = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetPermissions();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
