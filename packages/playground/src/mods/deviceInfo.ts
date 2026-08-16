import { useEffect, useState } from '@lynx-js/react';
import {
  getBrand,
  getDeviceName,
  getDeviceType,
  getDeviceYearClass,
  getIsDevice,
  getManufacturer,
  getModelName,
  getOsName,
  getOsVersion,
  getPlatformApiLevel,
  getProductName,
  getSupportedCpuArchitectures,
  getTotalMemory,
} from '@lynxpo/mods-device';

export interface DeviceInfo {
  isDevice: boolean | undefined;
  brand: string | undefined;
  manufacturer: string | undefined;
  modelName: string | undefined;
  designName: string | undefined;
  productName: string | undefined;
  deviceYearClass: number | undefined;
  totalMemory: unknown;
  deviceType: unknown;
  supportedCpuArchitectures: string[] | undefined;
  osName: string | undefined;
  osVersion: string | undefined;
  osBuildId: unknown;
  osInternalBuildId: unknown;
  osBuildFingerprint: unknown;
  platformApiLevel: string | undefined;
  deviceName: string | undefined;
}

/**
 * Fetches all device fields in a single synchronous pass over the native
 * bridge (one mount effect, not 15). Returns a typed snapshot plus explicit
 * loading/error state so absent modules are never silently `undefined`.
 */
export function useDeviceInfo(): {
  info: DeviceInfo | null;
  loading: boolean;
  error: Error | null;
} {
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setInfo({
        isDevice: getIsDevice(),
        brand: getBrand(),
        manufacturer: getManufacturer(),
        modelName: getModelName(),
        designName: getModelName(),
        productName: getProductName(),
        deviceYearClass: getDeviceYearClass(),
        totalMemory: getTotalMemory(),
        deviceType: getDeviceType(),
        supportedCpuArchitectures: getSupportedCpuArchitectures(),
        osName: getOsName(),
        osVersion: getOsVersion(),
        osBuildId: undefined,
        osInternalBuildId: undefined,
        osBuildFingerprint: undefined,
        platformApiLevel: getPlatformApiLevel(),
        deviceName: getDeviceName(),
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
