// Auto-generated from NotificationsModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface NotificationsModule extends INativeModules {
  permissionsAsync(): Record<string, any>;
  requestPermission(): void;
  isDeviceRegisteredForRemoteMessages(): boolean;
  badgeCountAsync(): number;
  devicePushTokenAsync(): Record<string, string>;
}

export const getPermissionsAsync = (): Record<string, any> =>
  NativeModules.NotificationsModule?.permissionsAsync?.();

export const usePermissionsAsync = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getPermissionsAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getRequestPermission = (): void =>
  NativeModules.NotificationsModule?.requestPermission?.();

export const useRequestPermission = () => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRequestPermission();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getIsDeviceRegisteredForRemoteMessages = (): boolean =>
  NativeModules.NotificationsModule?.isDeviceRegisteredForRemoteMessages?.();

export const useIsDeviceRegisteredForRemoteMessages = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsDeviceRegisteredForRemoteMessages();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getBadgeCountAsync = (): number =>
  NativeModules.NotificationsModule?.badgeCountAsync?.();

export const useBadgeCountAsync = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getBadgeCountAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getDevicePushTokenAsync = (): Record<string, string> =>
  NativeModules.NotificationsModule?.devicePushTokenAsync?.();

export const useDevicePushTokenAsync = () => {
  const [value, setValue] = useState<Record<string, string>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getDevicePushTokenAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
