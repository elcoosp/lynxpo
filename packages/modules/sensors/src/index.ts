import { useEffect, useState } from '@lynx-js/react';
import { SensorsModule } from './generated/SensorsModule';

export interface SensorReading {
  x: number;
  y: number;
  z: number;
}

export const getAccelerometer = (): SensorReading | null =>
  SensorsModule.getAccelerometer();

export const useAccelerometer = () => {
  const [value, setValue] = useState<SensorReading | null>();

  useEffect(() => {
    const fetchData = () => {
      setValue(getAccelerometer());
    };

    fetchData();
  }, []);

  return value;
};

export const getGyroscope = (): SensorReading | null =>
  SensorsModule.getGyroscope();

export const useGyroscope = () => {
  const [value, setValue] = useState<SensorReading | null>();

  useEffect(() => {
    const fetchData = () => {
      setValue(getGyroscope());
    };

    fetchData();
  }, []);

  return value;
};

export const getIsAvailable = (): boolean | null =>
  SensorsModule.isAvailable() ?? null;

export const useIsAvailable = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      setValue(getIsAvailable() ?? false);
    };

    fetchData();
  }, []);

  return value;
};

export const getAccelerometerAsync = (): Promise<SensorReading> =>
  SensorsModule.getAccelerometerAsync();

export const useAccelerometerAsync = () => {
  const [value, setValue] = useState<SensorReading>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getAccelerometerAsync();
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

export const getGyroscopeAsync = (): Promise<SensorReading> =>
  SensorsModule.getGyroscopeAsync();

export const useGyroscopeAsync = () => {
  const [value, setValue] = useState<SensorReading>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGyroscopeAsync();
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
