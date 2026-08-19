// Auto-generated from CameraModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface CameraModule extends INativeModules {
  cameraPermissionsAsync(): Record<string, any>;
  requestCameraPermission(): void;
  microphonePermissionsAsync(): Record<string, any>;
  availableCameraTypes(): string[];
  availableVideoCodecs(): string[];
  startCamera(): boolean;
  stopCamera(): void;
  flipCamera(): void;
  setTorch(enabled: boolean): void;
  isTorchAvailable(): boolean;
  captureFrame(): string;
}

export const getCameraPermissionsAsync = (): Record<string, any> =>
  NativeModules.CameraModule?.cameraPermissionsAsync?.();

export const useCameraPermissionsAsync = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getCameraPermissionsAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getRequestCameraPermission = (): void =>
  NativeModules.CameraModule?.requestCameraPermission?.();

export const useRequestCameraPermission = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRequestCameraPermission();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getMicrophonePermissionsAsync = (): Record<string, any> =>
  NativeModules.CameraModule?.microphonePermissionsAsync?.();

export const useMicrophonePermissionsAsync = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getMicrophonePermissionsAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getAvailableCameraTypes = (): string[] =>
  NativeModules.CameraModule?.availableCameraTypes?.();

export const useAvailableCameraTypes = () => {
  const [value, setValue] = useState<string[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getAvailableCameraTypes();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getAvailableVideoCodecs = (): string[] =>
  NativeModules.CameraModule?.availableVideoCodecs?.();

export const useAvailableVideoCodecs = () => {
  const [value, setValue] = useState<string[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getAvailableVideoCodecs();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getStartCamera = (): boolean =>
  NativeModules.CameraModule?.startCamera?.();

export const useStartCamera = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getStartCamera();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getStopCamera = (): void =>
  NativeModules.CameraModule?.stopCamera?.();

export const useStopCamera = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getStopCamera();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getFlipCamera = (): void =>
  NativeModules.CameraModule?.flipCamera?.();

export const useFlipCamera = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getFlipCamera();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSetTorch = (enabled: boolean): void =>
  NativeModules.CameraModule?.setTorch?.(enabled);

export const useSetTorch = (enabled: boolean) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSetTorch(enabled);
      setValue(result);
    };

    fetchData();
  }, [enabled]);

  return value;
};

export const getIsTorchAvailable = (): boolean =>
  NativeModules.CameraModule?.isTorchAvailable?.();

export const useIsTorchAvailable = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsTorchAvailable();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getCaptureFrame = (): string =>
  NativeModules.CameraModule?.captureFrame?.();

export const useCaptureFrame = () => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getCaptureFrame();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
