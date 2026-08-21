// Auto-generated from NotificationsModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { NotificationsModule } from './generated/NotificationsModule';

export const getPermissionsAsync = (): Record<string, any> =>
  NotificationsModule.permissionsAsync();

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
  NotificationsModule.requestPermission();

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
  NotificationsModule.isDeviceRegisteredForRemoteMessages();

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
  NotificationsModule.badgeCountAsync();

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
  NotificationsModule.devicePushTokenAsync();

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
