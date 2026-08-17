// Auto-generated from ImagePickerModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface ImagePickerModule extends INativeModules {
  getCameraPermissions(): Record<string, any>;
  getMediaLibraryPermissions(): Record<string, any>;
  getCameraPermissionsAsync(): Promise<any>;
  getMediaLibraryPermissionsAsync(): Promise<any>;
  launchImageLibraryAsync(): Promise<any>;
  launchCameraAsync(): Promise<any>;
}

export const getGetCameraPermissions = (): Record<string, any> =>
  NativeModules.ImagePickerModule?.getCameraPermissions?.();

export const useGetCameraPermissions = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetCameraPermissions();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetMediaLibraryPermissions = (): Record<string, any> =>
  NativeModules.ImagePickerModule?.getMediaLibraryPermissions?.();

export const useGetMediaLibraryPermissions = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetMediaLibraryPermissions();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetCameraPermissionsAsync = (): Promise<any> =>
  NativeModules.ImagePickerModule?.getCameraPermissionsAsync?.();

export const useGetCameraPermissionsAsync = () => {
  const [value, setValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetCameraPermissionsAsync();
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

export const getGetMediaLibraryPermissionsAsync = (): Promise<any> =>
  NativeModules.ImagePickerModule?.getMediaLibraryPermissionsAsync?.();

export const useGetMediaLibraryPermissionsAsync = () => {
  const [value, setValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getGetMediaLibraryPermissionsAsync();
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

export const getLaunchImageLibraryAsync = (): Promise<any> =>
  NativeModules.ImagePickerModule?.launchImageLibraryAsync?.();

export const useLaunchImageLibraryAsync = () => {
  const [value, setValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getLaunchImageLibraryAsync();
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

export const getLaunchCameraAsync = (): Promise<any> =>
  NativeModules.ImagePickerModule?.launchCameraAsync?.();

export const useLaunchCameraAsync = () => {
  const [value, setValue] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const result = await getLaunchCameraAsync();
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
