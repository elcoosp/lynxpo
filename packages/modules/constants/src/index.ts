// Auto-generated from ConstantsModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { ConstantsModule } from './generated/ConstantsModule';

export const getAppOwnership = (): string => ConstantsModule.appOwnership();

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

export const getPlatform = (): string => ConstantsModule.platform();

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
  ConstantsModule.executionEnvironment();

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

export const getSessionId = (): string => ConstantsModule.sessionId();

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

export const getInstallationId = (): string => ConstantsModule.installationId();

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

export const getIsHeadless = (): boolean => ConstantsModule.isHeadless();

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

export const getSystemFonts = (): string[] => ConstantsModule.systemFonts();

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
  ConstantsModule.version();

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
