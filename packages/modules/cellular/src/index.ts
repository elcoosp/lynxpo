// Auto-generated from CellularModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { CellularModule } from './generated/CellularModule';

export const getGetCellularGeneration = (): number =>
  CellularModule.getCellularGeneration();

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
  CellularModule.getIsoCountryCode();

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
  CellularModule.getCarrierName();

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
  CellularModule.getMobileCountryCode();

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
  CellularModule.getMobileNetworkCode();

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
  CellularModule.getCellularGenerationAsync();

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
  CellularModule.getIsoCountryCodeAsync();

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
  CellularModule.getCarrierNameAsync();

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
  CellularModule.getMobileCountryCodeAsync();

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
  CellularModule.getMobileNetworkCodeAsync();

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
