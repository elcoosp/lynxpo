// Auto-generated from Asset.kt
import { useEffect, useState } from '@lynx-js/react';
import { Asset } from './generated/Asset';

export const getIsAvailableAsync = (): boolean =>
  Asset.isAvailableAsync();

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

export const getAssetInfoAsync = (uri: string): Record<string, any> =>
  NativeModules.Asset?.assetInfoAsync?.(uri);

export const useAssetInfoAsync = (uri: string) => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getAssetInfoAsync(uri);
      setValue(result);
    };

    fetchData();
  }, [uri]);

  return value;
};

export const getLocalUriAsync = (uri: string): string =>
  NativeModules.Asset?.localUriAsync?.(uri);

export const useLocalUriAsync = (uri: string) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getLocalUriAsync(uri);
      setValue(result);
    };

    fetchData();
  }, [uri]);

  return value;
};
