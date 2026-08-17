// Auto-generated from CellularModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface CellularModule extends INativeModules {
  getCellularGeneration(): number;
  getIsoCountryCode(): string | null;
  getCarrierName(): string | null;
  getMobileCountryCode(): string | null;
  getMobileNetworkCode(): string | null;
  getCellularGenerationAsync(): Promise<number>;
  getIsoCountryCodeAsync(): Promise<string>;
  getCarrierNameAsync(): Promise<string>;
  getMobileCountryCodeAsync(): Promise<string>;
  getMobileNetworkCodeAsync(): Promise<string>;
}

export const getGetCellularGeneration = (): number =>
  NativeModules.CellularModule?.getCellularGeneration?.();

export const useGetCellularGeneration = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetCellularGeneration();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetIsoCountryCode = (): string | null =>
  NativeModules.CellularModule?.getIsoCountryCode?.();

export const useGetIsoCountryCode = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetIsoCountryCode();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetCarrierName = (): string | null =>
  NativeModules.CellularModule?.getCarrierName?.();

export const useGetCarrierName = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetCarrierName();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetMobileCountryCode = (): string | null =>
  NativeModules.CellularModule?.getMobileCountryCode?.();

export const useGetMobileCountryCode = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetMobileCountryCode();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetMobileNetworkCode = (): string | null =>
  NativeModules.CellularModule?.getMobileNetworkCode?.();

export const useGetMobileNetworkCode = () => {
  const [value, setValue] = useState<string | null>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetMobileNetworkCode();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetCellularGenerationAsync = (): Promise<number> =>
  NativeModules.CellularModule?.getCellularGenerationAsync?.();

export const useGetCellularGenerationAsync = () => {
  const [value, setValue] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetCellularGenerationAsync();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { value, loading, error };
};

export const getGetIsoCountryCodeAsync = (): Promise<string> =>
  NativeModules.CellularModule?.getIsoCountryCodeAsync?.();

export const useGetIsoCountryCodeAsync = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetIsoCountryCodeAsync();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { value, loading, error };
};

export const getGetCarrierNameAsync = (): Promise<string> =>
  NativeModules.CellularModule?.getCarrierNameAsync?.();

export const useGetCarrierNameAsync = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetCarrierNameAsync();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { value, loading, error };
};

export const getGetMobileCountryCodeAsync = (): Promise<string> =>
  NativeModules.CellularModule?.getMobileCountryCodeAsync?.();

export const useGetMobileCountryCodeAsync = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetMobileCountryCodeAsync();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { value, loading, error };
};

export const getGetMobileNetworkCodeAsync = (): Promise<string> =>
  NativeModules.CellularModule?.getMobileNetworkCodeAsync?.();

export const useGetMobileNetworkCodeAsync = () => {
  const [value, setValue] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetMobileNetworkCodeAsync();
        if (isMounted) {
          setValue(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { value, loading, error };
};
