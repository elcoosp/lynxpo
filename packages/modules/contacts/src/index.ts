// Auto-generated from ContactsModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface ContactsModule extends INativeModules {
  permissionsAsync(): Record<string, any>;
  requestPermission(): void;
  contactCount(): number;
  containerCount(): number;
}

export const getPermissionsAsync = (): Record<string, any> =>
  NativeModules.ContactsModule?.permissionsAsync?.();

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
  NativeModules.ContactsModule?.requestPermission?.();

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

export const getContactCount = (): number =>
  NativeModules.ContactsModule?.contactCount?.();

export const useContactCount = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getContactCount();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getContainerCount = (): number =>
  NativeModules.ContactsModule?.containerCount?.();

export const useContainerCount = () => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    const fetchData = () => {
      const result = getContainerCount();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
