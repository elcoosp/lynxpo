// Auto-generated from NotificationsModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { NotificationsModule } from './generated/NotificationsModule';

export const getPermissionsAsync = (): Promise<Record<string, any>> =>
  NotificationsModule.permissionsAsync() as Promise<Record<string, any>>;

export const usePermissionsAsync = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getPermissionsAsync();
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

export const getDevicePushTokenAsync = (): Promise<Record<string, string>> =>
  NotificationsModule.devicePushTokenAsync() as Promise<Record<string, string>>;

export const useDevicePushTokenAsync = () => {
  const [value, setValue] = useState<Record<string, string>>();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getDevicePushTokenAsync();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
