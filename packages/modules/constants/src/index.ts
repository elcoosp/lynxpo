// Auto-generated from ConstantsModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface ConstantsModule extends INativeModules {
  appOwnership(): string;
  platform(): string;
  executionEnvironment(): string;
  sessionId(): string;
  installationId(): string;
  isHeadless(): boolean;
  systemFonts(): string[];
  version(): Record<string, string>;
}

export const getAppOwnership = (): string =>
  NativeModules.ConstantsModule?.appOwnership?.();

export const useAppOwnership = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getAppOwnership();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getPlatform = (): string =>
  NativeModules.ConstantsModule?.platform?.();

export const usePlatform = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getPlatform();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getExecutionEnvironment = (): string =>
  NativeModules.ConstantsModule?.executionEnvironment?.();

export const useExecutionEnvironment = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getExecutionEnvironment();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSessionId = (): string =>
  NativeModules.ConstantsModule?.sessionId?.();

export const useSessionId = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSessionId();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getInstallationId = (): string =>
  NativeModules.ConstantsModule?.installationId?.();

export const useInstallationId = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getInstallationId();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getIsHeadless = (): boolean =>
  NativeModules.ConstantsModule?.isHeadless?.();

export const useIsHeadless = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsHeadless();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSystemFonts = (): string[] =>
  NativeModules.ConstantsModule?.systemFonts?.();

export const useSystemFonts = () => {
  const [value, setValue] = useState<string[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSystemFonts();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getVersion = (): Record<string, string> =>
  NativeModules.ConstantsModule?.version?.();

export const useVersion = () => {
  const [value, setValue] = useState<Record<string, string>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getVersion();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
