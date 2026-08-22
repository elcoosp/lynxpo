// Auto-generated from MusicLibrary.kt
// NOTE: There is no current `expo-music-library` package on Expo main (it was
// removed/deprecated in favor of `expo-media-library`). This module is an
// intentionally-retained LynxPo original exposing music-library capability
// that has no current upstream Expo module to port from.
import { useEffect, useState } from '@lynx-js/react';
import { MusicLibrary } from './generated/MusicLibrary';

export const getGetAlbums = (): Record<string, any>[] =>
  MusicLibrary.getAlbums();

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
  MusicLibrary.requestPermissions();

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
  MusicLibrary.getPermissions();

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
