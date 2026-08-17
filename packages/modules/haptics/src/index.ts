// Auto-generated from HapticsModule.kt
import { useEffect, useState } from '@lynx-js/react';
import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface HapticsModule extends INativeModules {
  impactAsync(style: number): Promise<void>;
  notificationAsync(type: number): Promise<void>;
  selectionAsync(): Promise<void>;
}

export const getImpactAsync = (style: number): Promise<void> =>
  NativeModules.HapticsModule?.impactAsync?.(style);

export const useImpactAsync = (style: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      await getImpactAsync(style);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run };
};

export const getNotificationAsync = (type: number): Promise<void> =>
  NativeModules.HapticsModule?.notificationAsync?.(type);

export const useNotificationAsync = (type: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      await getNotificationAsync(type);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run };
};

export const getSelectionAsync = (): Promise<void> =>
  NativeModules.HapticsModule?.selectionAsync?.();

export const useSelectionAsync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      await getSelectionAsync();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, run };
};
