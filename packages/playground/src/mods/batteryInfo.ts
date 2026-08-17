import { useEffect, useState } from '@lynx-js/react';
import {
  getGetBatteryLevel,
  getGetBatteryState,
  getIsBatteryOptimizationEnabled,
  getIsLowPowerModeEnabled,
} from '@lynxpo/mods-battery';

export interface BatteryInfo {
  batteryLevel: number; // 0..1, or -1 if unknown
  batteryState: number; // BatteryState enum (0 UNKNOWN..4 NOT_CHARGING)
  lowPowerMode: boolean;
  batteryOptimizationEnabled: boolean;
}

const BATTERY_STATE_LABELS = [
  'Unavailable', // 0 UNKNOWN — e.g. iOS Simulator has no physical battery
  'Unplugged',
  'Charging',
  'Full',
  'Not charging',
];

export function batteryStateLabel(state: number): string {
  return BATTERY_STATE_LABELS[state] ?? 'Unavailable';
}

/**
 * Fetches all battery fields in a single synchronous pass over the native
 * bridge. Returns a typed snapshot plus explicit loading/error state. Faithful
 * port of Expo's `expo-battery` (v57) native surface.
 */
export function useBatteryInfo(): {
  info: BatteryInfo | null;
  loading: boolean;
  error: Error | null;
} {
  const [info, setInfo] = useState<BatteryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setInfo({
        batteryLevel: getGetBatteryLevel(),
        batteryState: getGetBatteryState(),
        lowPowerMode: getIsLowPowerModeEnabled(),
        batteryOptimizationEnabled: getIsBatteryOptimizationEnabled(),
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  return { info, loading, error };
}
