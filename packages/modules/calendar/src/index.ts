// Auto-generated from Calendar.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface Calendar extends INativeModules {
  getCalendars(): Record<string, any>[];
  getEvents(startDate: string, endDate: string): Record<string, any>[];
  requestPermissions(): Record<string, any>;
  getPermissions(): Record<string, any>;
  createEvent(title: string, startDate: string, endDate: string): string;
}

export const getGetCalendars = (): Record<string, any>[] =>
  NativeModules.Calendar?.getCalendars?.();

export const useGetCalendars = () => {
  const [value, setValue] = useState<Record<string, any>[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetCalendars();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetEvents = (
  startDate: string,
  endDate: string,
): Record<string, any>[] =>
  NativeModules.Calendar?.getEvents?.(startDate, endDate);

export const useGetEvents = (startDate: string, endDate: string) => {
  const [value, setValue] = useState<Record<string, any>[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetEvents(startDate, endDate);
      setValue(result);
    };

    fetchData();
  }, [startDate, endDate]);

  return value;
};

export const getRequestPermissions = (): Record<string, any> =>
  NativeModules.Calendar?.requestPermissions?.();

export const useRequestPermissions = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getRequestPermissions();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getGetPermissions = (): Record<string, any> =>
  NativeModules.Calendar?.getPermissions?.();

export const useGetPermissions = () => {
  const [value, setValue] = useState<Record<string, any>>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetPermissions();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getCreateEvent = (
  title: string,
  startDate: string,
  endDate: string,
): string => NativeModules.Calendar?.createEvent?.(title, startDate, endDate);

export const useCreateEvent = (
  title: string,
  startDate: string,
  endDate: string,
) => {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const fetchData = () => {
      const result = getCreateEvent(title, startDate, endDate);
      setValue(result);
    };

    fetchData();
  }, [title, startDate, endDate]);

  return value;
};
