// Auto-generated from Image.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface Image extends INativeModules {
  getCacheSize(): number;
  clearCache(): void;
  prefetch(url: string): boolean;
  isImageLoading(uri: string): boolean;
  cancelLoading(uri: string): void;
}

export const getGetCacheSize = (): number =>
  NativeModules.Image?.getCacheSize?.();

export const useGetCacheSize = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetCacheSize();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getClearCache = (): void => NativeModules.Image?.clearCache?.();

export const useClearCache = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getClearCache();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getPrefetch = (url: string): boolean =>
  NativeModules.Image?.prefetch?.(url);

export const usePrefetch = (url: string) => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getPrefetch(url);
      setValue(result);
    };

    fetchData();
  }, [url]);

  return value;
};

export const getIsImageLoading = (uri: string): boolean =>
  NativeModules.Image?.isImageLoading?.(uri);

export const useIsImageLoading = (uri: string) => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsImageLoading(uri);
      setValue(result);
    };

    fetchData();
  }, [uri]);

  return value;
};

export const getCancelLoading = (uri: string): void =>
  NativeModules.Image?.cancelLoading?.(uri);

export const useCancelLoading = (uri: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getCancelLoading(uri);
      setValue(result);
    };

    fetchData();
  }, [uri]);

  return value;
};
