// Auto-generated from BatteryModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { BatteryModule } from './generated/BatteryModule';

export const getGetBatteryLevel = (): any =>
  BatteryModule.getBatteryLevel();

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
  BatteryModule.getBatteryState();

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
  BatteryModule.isLowPowerModeEnabled();

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
  BatteryModule.isBatteryOptimizationEnabled();

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
