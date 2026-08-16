// Auto-generated from DeviceModule.kt
import { useEffect, useState } from "@lynx-js/react";
import { NativeModules as INativeModules } from "@lynx-js/types";

export enum DeviceType {
  UNKNOWN,
  PHONE,
  TABLET,
  DESKTOP,
  TV
}

export interface DeviceModule extends INativeModules {
  isDevice(): any;
  brand(): any;
  manufacturer(): any;
  modelName(): any;
  designName(): any;
  productName(): any;
  deviceYearClass(): any;
  totalMemory(): any;
  deviceType(): any;
  supportedCpuArchitectures(): any;
  osName(): any;
  osVersion(): any;
  osBuildId(): any;
  osInternalBuildId(): any;
  osBuildFingerprint(): any;
  platformApiLevel(): any;
  deviceName(): any;
};

export const getIsDevice = (): any =>
  NativeModules.DeviceModule?.isDevice?.();

export const useIsDevice = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsDevice();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getBrand = (): any =>
  NativeModules.DeviceModule?.brand?.();

export const useBrand = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getBrand();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getManufacturer = (): any =>
  NativeModules.DeviceModule?.manufacturer?.();

export const useManufacturer = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getManufacturer();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getModelName = (): any =>
  NativeModules.DeviceModule?.modelName?.();

export const useModelName = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getModelName();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getDesignName = (): any =>
  NativeModules.DeviceModule?.designName?.();

export const useDesignName = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getDesignName();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getProductName = (): any =>
  NativeModules.DeviceModule?.productName?.();

export const useProductName = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getProductName();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getDeviceYearClass = (): any =>
  NativeModules.DeviceModule?.deviceYearClass?.();

export const useDeviceYearClass = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getDeviceYearClass();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getTotalMemory = (): any =>
  NativeModules.DeviceModule?.totalMemory?.();

export const useTotalMemory = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getTotalMemory();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getDeviceType = (): any =>
  NativeModules.DeviceModule?.deviceType?.();

export const useDeviceType = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getDeviceType();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSupportedCpuArchitectures = (): any =>
  NativeModules.DeviceModule?.supportedCpuArchitectures?.();

export const useSupportedCpuArchitectures = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSupportedCpuArchitectures();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getOsName = (): any =>
  NativeModules.DeviceModule?.osName?.();

export const useOsName = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getOsName();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getOsVersion = (): any =>
  NativeModules.DeviceModule?.osVersion?.();

export const useOsVersion = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getOsVersion();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getOsBuildId = (): any =>
  NativeModules.DeviceModule?.osBuildId?.();

export const useOsBuildId = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getOsBuildId();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getOsInternalBuildId = (): any =>
  NativeModules.DeviceModule?.osInternalBuildId?.();

export const useOsInternalBuildId = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getOsInternalBuildId();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getOsBuildFingerprint = (): any =>
  NativeModules.DeviceModule?.osBuildFingerprint?.();

export const useOsBuildFingerprint = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getOsBuildFingerprint();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getPlatformApiLevel = (): any =>
  NativeModules.DeviceModule?.platformApiLevel?.();

export const usePlatformApiLevel = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getPlatformApiLevel();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getDeviceName = (): any =>
  NativeModules.DeviceModule?.deviceName?.();

export const useDeviceName = () => {
  const [value, setValue] = useState<any>();

  useEffect(() => {
    const fetchData = () => {
      const result = getDeviceName();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
