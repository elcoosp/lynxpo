// Auto-generated from ApplicationModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { ApplicationModule } from './generated/ApplicationModule';

export const getApplicationName = (): any =>
  ApplicationModule.applicationName();

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
  ApplicationModule.applicationId();

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
  ApplicationModule.nativeApplicationVersion();

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
  ApplicationModule.nativeBuildVersion();

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
  ApplicationModule.androidId();

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
  ApplicationModule.getInstallationTime();

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
  ApplicationModule.getLastUpdateTime();

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
