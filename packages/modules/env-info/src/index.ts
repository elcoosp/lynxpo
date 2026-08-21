// Auto-generated from EnvInfoModule.kt
import { useEffect, useState } from "@lynx-js/react";
import { EnvInfoModule } from './generated/EnvInfoModule';



;

export const getIsRunningOnDevice = (): boolean =>
  EnvInfoModule.isRunningOnDevice();

export const useIsRunningOnDevice = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsRunningOnDevice();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getInstallTime = (): number =>
  EnvInfoModule.installTime();

export const useInstallTime = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getInstallTime();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getEnvInfo = (): Record<string, any | null> =>
  EnvInfoModule.envInfo();

export const useEnvInfo = () => {
  const [value, setValue] = useState<Record<string, any | null>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getEnvInfo();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
