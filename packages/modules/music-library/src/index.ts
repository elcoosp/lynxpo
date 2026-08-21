// Auto-generated from MusicLibrary.kt
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
