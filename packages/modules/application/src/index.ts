// Auto-generated from ApplicationModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface ApplicationModule extends INativeModules {
  applicationName(): any;
  applicationId(): any;
  nativeApplicationVersion(): any;
  nativeBuildVersion(): any;
  androidId(): any;
  getInstallationTime(): any;
  getLastUpdateTime(): any;
}

export const getApplicationName = (): any =>
  NativeModules.ApplicationModule?.applicationName?.();

export const useApplicationName = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getApplicationName();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getApplicationId = (): any =>
  NativeModules.ApplicationModule?.applicationId?.();

export const useApplicationId = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getApplicationId();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getNativeApplicationVersion = (): any =>
  NativeModules.ApplicationModule?.nativeApplicationVersion?.();

export const useNativeApplicationVersion = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getNativeApplicationVersion();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getNativeBuildVersion = (): any =>
  NativeModules.ApplicationModule?.nativeBuildVersion?.();

export const useNativeBuildVersion = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getNativeBuildVersion();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getAndroidId = (): any =>
  NativeModules.ApplicationModule?.androidId?.();

export const useAndroidId = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getAndroidId();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetInstallationTime = (): any =>
  NativeModules.ApplicationModule?.getInstallationTime?.();

export const useGetInstallationTime = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetInstallationTime();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetLastUpdateTime = (): any =>
  NativeModules.ApplicationModule?.getLastUpdateTime?.();

export const useGetLastUpdateTime = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetLastUpdateTime();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
