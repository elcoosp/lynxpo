/**
 * Generated TypeScript definitions from Lynx Native Module : DeviceModule
 */

/**
 * DeviceModule superdoc
 */

export enum DeviceType {
  /**
   * DeviceType.UNKNOWN field superdoc
   */
  UNKNOWN = 0,
  PHONE = 1,
  TABLET = 2,
  DESKTOP = 3,
  TV = 4,
}

/**
 * Is it a device ? superdoc
 */
export function isDevice(): boolean {}
export const getIsDevice = (): boolean => NativeModules.DeviceModule.isDevice();
export const useIsDevice = () => {
  const [value, setValue] = useState<boolean>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getIsDevice();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function brand(): string {}
export const getBrand = (): string => NativeModules.DeviceModule.brand();
export const useBrand = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getBrand();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function manufacturer(): string {}
export const getManufacturer = (): string =>
  NativeModules.DeviceModule.manufacturer();
export const useManufacturer = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getManufacturer();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function modelName(): string {}
export const getModelName = (): string =>
  NativeModules.DeviceModule.modelName();
export const useModelName = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getModelName();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function designName(): string {}
export const getDesignName = (): string =>
  NativeModules.DeviceModule.designName();
export const useDesignName = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getDesignName();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function productName(): string {}
export const getProductName = (): string =>
  NativeModules.DeviceModule.productName();
export const useProductName = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getProductName();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function totalMemory(): number {}
export const getTotalMemory = (): number =>
  NativeModules.DeviceModule.totalMemory();
export const useTotalMemory = () => {
  const [value, setValue] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getTotalMemory();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function deviceType(): DeviceType {}
export const getDeviceType = (): DeviceType =>
  NativeModules.DeviceModule.deviceType();
export const useDeviceType = () => {
  const [value, setValue] = useState<DeviceType>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getDeviceType();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function supportedCpuArchitectures(): string[] | null {}
export const getSupportedCpuArchitectures = (): string[] | null =>
  NativeModules.DeviceModule.supportedCpuArchitectures();
export const useSupportedCpuArchitectures = () => {
  const [value, setValue] = useState<string[] | null>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getSupportedCpuArchitectures();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function osName(): string {}
export const getOsName = (): string => NativeModules.DeviceModule.osName();
export const useOsName = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getOsName();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function osVersion(): string {}
export const getOsVersion = (): string =>
  NativeModules.DeviceModule.osVersion();
export const useOsVersion = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getOsVersion();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function osBuildId(): string {}
export const getOsBuildId = (): string =>
  NativeModules.DeviceModule.osBuildId();
export const useOsBuildId = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getOsBuildId();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function osInternalBuildId(): string {}
export const getOsInternalBuildId = (): string =>
  NativeModules.DeviceModule.osInternalBuildId();
export const useOsInternalBuildId = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getOsInternalBuildId();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function osBuildFingerprint(): string {}
export const getOsBuildFingerprint = (): string =>
  NativeModules.DeviceModule.osBuildFingerprint();
export const useOsBuildFingerprint = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getOsBuildFingerprint();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function platformApiLevel(): number {}
export const getPlatformApiLevel = (): number =>
  NativeModules.DeviceModule.platformApiLevel();
export const usePlatformApiLevel = () => {
  const [value, setValue] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getPlatformApiLevel();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};

export function deviceName(): string {}
export const getDeviceName = (): string =>
  NativeModules.DeviceModule.deviceName();
export const useDeviceName = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await getDeviceName();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  return { value, loading, error };
};
