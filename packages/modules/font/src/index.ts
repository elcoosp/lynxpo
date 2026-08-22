// Auto-generated from FontModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { FontModule } from './generated/FontModule';

export const getIsLoaded = (fontFamily: string): boolean =>
  NativeModules.FontModule?.isLoaded?.(fontFamily);

export const useIsLoaded = (fontFamily: string) => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsLoaded(fontFamily);
      setValue(result);
    };

    fetchData();
  }, [fontFamily]);

  return value;
};

export const getLoadedFonts = (): string[] => FontModule.loadedFonts();

export const useLoadedFonts = () => {
  const [value, setValue] = useState<string[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getLoadedFonts();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getProcessFontFamily = (fontFamily: string): string =>
  NativeModules.FontModule?.processFontFamily?.(fontFamily);

export const useProcessFontFamily = (fontFamily: string) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getProcessFontFamily(fontFamily);
      setValue(result);
    };

    fetchData();
  }, [fontFamily]);

  return value;
};

export const getLoadAsync = (fontFamily: string): void =>
  NativeModules.FontModule?.loadAsync?.(fontFamily);

export const useLoadAsync = (fontFamily: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getLoadAsync(fontFamily);
      setValue(result);
    };

    fetchData();
  }, [fontFamily]);

  return value;
};
