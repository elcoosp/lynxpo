// Auto-generated from CellularModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface CellularModule extends INativeModules {
  getCellularGeneration(): number;
  getIsoCountryCode(): string | null;
  getCarrierName(): string | null;
  getMobileCountryCode(): string | null;
  getMobileNetworkCode(): string | null;
}

export const getGetCellularGeneration = (): number =>
  NativeModules.CellularModule?.getCellularGeneration?.();

export const useGetCellularGeneration = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetCellularGeneration();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetIsoCountryCode = (): string | null =>
  NativeModules.CellularModule?.getIsoCountryCode?.();

export const useGetIsoCountryCode = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetIsoCountryCode();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetCarrierName = (): string | null =>
  NativeModules.CellularModule?.getCarrierName?.();

export const useGetCarrierName = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetCarrierName();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetMobileCountryCode = (): string | null =>
  NativeModules.CellularModule?.getMobileCountryCode?.();

export const useGetMobileCountryCode = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetMobileCountryCode();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetMobileNetworkCode = (): string | null =>
  NativeModules.CellularModule?.getMobileNetworkCode?.();

export const useGetMobileNetworkCode = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetMobileNetworkCode();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
