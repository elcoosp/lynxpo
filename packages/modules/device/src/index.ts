// Auto-generated from DeviceModule.kt
import { useEffect, useState } from "@lynx-js/react";



export type DeviceModule = {
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

export const getIsDevice = () => 
  NativeModules.DeviceModule.isDevice();

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

export const getBrand = () => 
  NativeModules.DeviceModule.brand();

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

export const getManufacturer = () => 
  NativeModules.DeviceModule.manufacturer();

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

export const getModelName = () => 
  NativeModules.DeviceModule.modelName();

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

export const getDesignName = () => 
  NativeModules.DeviceModule.designName();

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

export const getProductName = () => 
  NativeModules.DeviceModule.productName();

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

export const getDeviceYearClass = () => 
  NativeModules.DeviceModule.deviceYearClass();

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

export const getTotalMemory = () => 
  NativeModules.DeviceModule.totalMemory();

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

export const getDeviceType = () => 
  NativeModules.DeviceModule.deviceType();

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

export const getSupportedCpuArchitectures = () => 
  NativeModules.DeviceModule.supportedCpuArchitectures();

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

export const getOsName = () => 
  NativeModules.DeviceModule.osName();

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

export const getOsVersion = () => 
  NativeModules.DeviceModule.osVersion();

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

export const getOsBuildId = () => 
  NativeModules.DeviceModule.osBuildId();

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

export const getOsInternalBuildId = () => 
  NativeModules.DeviceModule.osInternalBuildId();

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

export const getOsBuildFingerprint = () => 
  NativeModules.DeviceModule.osBuildFingerprint();

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

export const getPlatformApiLevel = () => 
  NativeModules.DeviceModule.platformApiLevel();

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

export const getDeviceName = () => 
  NativeModules.DeviceModule.deviceName();

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
