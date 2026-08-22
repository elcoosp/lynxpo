// Auto-generated from SpeechModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { SpeechModule } from './generated/SpeechModule';

export const getIsSpeaking = (): boolean => SpeechModule.isSpeaking();

export const useIsSpeaking = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getIsSpeaking();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getSupported = (): boolean => SpeechModule.supported();

export const useSupported = () => {
  const [value, setValue] = useState<boolean>();

  useEffect(() => {
    const fetchData = () => {
      const result = getSupported();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};

export const getVoices = (): Record<string, string>[] => SpeechModule.voices();

export const useVoices = () => {
  const [value, setValue] = useState<Record<string, string>[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getVoices();
      setValue(result);
    };

    fetchData();
  }, []);

  return value;
};
