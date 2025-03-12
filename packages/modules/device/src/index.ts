// Auto-generated from NativeDeviceModule.kt
import { useEffect, useState } from "@lynx-js/react";



export type NativeDeviceModule = {
  isRunningOnEmulator(): boolean;
  isDevice(): boolean;
  brand(): string | null;
  manufacturer(): string | null;
  modelName(): string | null;
  designName(): string | null;
  productName(): string | null;
  deviceYearClass(): number;
  totalMemory(): number;
  deviceType(): number;
  osName(): string;
  osVersion(): string | null;
  platformApiLevel(): number;
  getDeviceTypeAsync(): number;
  getUptimeAsync(): number;
  isRootedExperimentalAsync(): boolean;
};

export const getIsRunningOnEmulator = () => 
  NativeModules.NativeDeviceModule.isRunningOnEmulator();

export const useIsRunningOnEmulator = () => {
  const [value, setValue] = useState<boolean>();
  
  useEffect(() => {
    const fetchData = () => {
      const result = getIsRunningOnEmulator();
      setValue(result);
    };
    
    fetchData();
  }, []);
  
  return value;
};

export const getIsDevice = () => 
  NativeModules.NativeDeviceModule.isDevice();

export const useIsDevice = () => {
  const [value, setValue] = useState<boolean>();
  
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
  NativeModules.NativeDeviceModule.brand();

export const useBrand = () => {
  const [value, setValue] = useState<string | null>();
  
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
  NativeModules.NativeDeviceModule.manufacturer();

export const useManufacturer = () => {
  const [value, setValue] = useState<string | null>();
  
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
  NativeModules.NativeDeviceModule.modelName();

export const useModelName = () => {
  const [value, setValue] = useState<string | null>();
  
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
  NativeModules.NativeDeviceModule.designName();

export const useDesignName = () => {
  const [value, setValue] = useState<string | null>();
  
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
  NativeModules.NativeDeviceModule.productName();

export const useProductName = () => {
  const [value, setValue] = useState<string | null>();
  
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
  NativeModules.NativeDeviceModule.deviceYearClass();

export const useDeviceYearClass = () => {
  const [value, setValue] = useState<number>();
  
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
  NativeModules.NativeDeviceModule.totalMemory();

export const useTotalMemory = () => {
  const [value, setValue] = useState<number>();
  
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
  NativeModules.NativeDeviceModule.deviceType();

export const useDeviceType = () => {
  const [value, setValue] = useState<number>();
  
  useEffect(() => {
    const fetchData = () => {
      const result = getDeviceType();
      setValue(result);
    };
    
    fetchData();
  }, []);
  
  return value;
};

export const getOsName = () => 
  NativeModules.NativeDeviceModule.osName();

export const useOsName = () => {
  const [value, setValue] = useState<string>();
  
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
  NativeModules.NativeDeviceModule.osVersion();

export const useOsVersion = () => {
  const [value, setValue] = useState<string | null>();
  
  useEffect(() => {
    const fetchData = () => {
      const result = getOsVersion();
      setValue(result);
    };
    
    fetchData();
  }, []);
  
  return value;
};

export const getPlatformApiLevel = () => 
  NativeModules.NativeDeviceModule.platformApiLevel();

export const usePlatformApiLevel = () => {
  const [value, setValue] = useState<number>();
  
  useEffect(() => {
    const fetchData = () => {
      const result = getPlatformApiLevel();
      setValue(result);
    };
    
    fetchData();
  }, []);
  
  return value;
};

export const getGetDeviceTypeAsync = () => 
  NativeModules.NativeDeviceModule.getDeviceTypeAsync();

export const useGetDeviceTypeAsync = () => {
  const [value, setValue] = useState<number>();
  
  useEffect(() => {
    const fetchData = () => {
      const result = getGetDeviceTypeAsync();
      setValue(result);
    };
    
    fetchData();
  }, []);
  
  return value;
};

export const getGetUptimeAsync = () => 
  NativeModules.NativeDeviceModule.getUptimeAsync();

export const useGetUptimeAsync = () => {
  const [value, setValue] = useState<number>();
  
  useEffect(() => {
    const fetchData = () => {
      const result = getGetUptimeAsync();
      setValue(result);
    };
    
    fetchData();
  }, []);
  
  return value;
};

export const getIsRootedExperimentalAsync = () => 
  NativeModules.NativeDeviceModule.isRootedExperimentalAsync();

export const useIsRootedExperimentalAsync = () => {
  const [value, setValue] = useState<boolean>();
  
  useEffect(() => {
    const fetchData = () => {
      const result = getIsRootedExperimentalAsync();
      setValue(result);
    };
    
    fetchData();
  }, []);
  
  return value;
};
