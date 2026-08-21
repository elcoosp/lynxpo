// Auto-generated from Sms.kt
import { useEffect, useState } from '@lynx-js/react';
import { Sms } from './generated/Sms';

export const getIsAvailable = (): boolean => Sms.isAvailable();

export const useIsAvailable = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsAvailable();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSendSMS = (addresses: string[], message: string): void =>
  NativeModules.Sms?.sendSMS?.(addresses, message);

export const useSendSMS = (addresses: string[], message: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSendSMS(addresses, message);
      setValue(result);
    };

    fetchData();
  }, [addresses, message]);

  return value;
};
