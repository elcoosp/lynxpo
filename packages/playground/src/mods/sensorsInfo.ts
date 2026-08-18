import { useEffect, useState } from '@lynx-js/react';
import {
  getAccelerometer,
  getGyroscope,
  getIsAvailable,
} from '@lynxpo/mods-sensors';

export interface ModuleInfo {
  rows: { label: string; value: string }[];
  loading: boolean;
  error: Error | null;
}

/**
 * Fetches native motion-sensor readings in a single synchronous pass over the
 * bridge, returning typed showcase rows. Faithful port of Expo's expo-sensors
 * surface (accelerometer + gyroscope + availability).
 */
export function useSensorsInfo(): ModuleInfo {
  const [rows, setRows] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const available = getIsAvailable() ?? false;
      const accel = getAccelerometer() ?? { x: 0, y: 0, z: 0 };
      const gyro = getGyroscope() ?? { x: 0, y: 0, z: 0 };
      const f = (n: number) => (typeof n === 'number' ? n.toFixed(3) : '—');
      setRows([
        { label: 'Sensors available', value: available ? 'Yes' : 'No' },
        {
          label: 'Accelerometer (x,y,z)',
          value: `${f(accel.x)}, ${f(accel.y)}, ${f(accel.z)}`,
        },
        {
          label: 'Gyroscope (x,y,z)',
          value: `${f(gyro.x)}, ${f(gyro.y)}, ${f(gyro.z)}`,
        },
      ]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  return { rows, loading, error };
}
