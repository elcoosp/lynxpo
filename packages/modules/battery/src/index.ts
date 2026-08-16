// Auto-generated from BatteryModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { NativeModules as INativeModules } from '@lynx-js/types';

export interface BatteryModule extends INativeModules {
  getBatteryLevel(): any;
  getBatteryState(): any;
  isLowPowerModeEnabled(): any;
  isBatteryOptimizationEnabled(): any;
}

export const getGetBatteryLevel = (): any =>
  NativeModules.BatteryModule?.getBatteryLevel?.();

export const useGetBatteryLevel = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetBatteryLevel();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetBatteryState = (): any =>
  NativeModules.BatteryModule?.getBatteryState?.();

export const useGetBatteryState = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetBatteryState();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getIsLowPowerModeEnabled = (): any =>
  NativeModules.BatteryModule?.isLowPowerModeEnabled?.();

export const useIsLowPowerModeEnabled = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsLowPowerModeEnabled();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getIsBatteryOptimizationEnabled = (): any =>
  NativeModules.BatteryModule?.isBatteryOptimizationEnabled?.();

export const useIsBatteryOptimizationEnabled = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsBatteryOptimizationEnabled();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
