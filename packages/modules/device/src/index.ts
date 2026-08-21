// @lynxpo/mods-device — autolink facade.
// `generated/DeviceModule.ts` is produced by @lynx-js/autolink-codegen from
// types/index.d.ts and exposes NativeModules.DeviceModule with the typed API.
import { DeviceModule } from './generated/DeviceModule';

export const getIsDevice = (): boolean | undefined =>
  DeviceModule?.isDevice?.();
export const getBrand = (): string | undefined => DeviceModule?.brand?.();
export const getManufacturer = (): string | undefined =>
  DeviceModule?.manufacturer?.();
export const getModelName = (): string | undefined =>
  DeviceModule?.modelName?.();
export const getDesignName = (): string | undefined =>
  DeviceModule?.designName?.();
export const getProductName = (): string | undefined =>
  DeviceModule?.productName?.();
export const getDeviceYearClass = (): number | undefined =>
  DeviceModule?.deviceYearClass?.();
export const getTotalMemory = (): number | undefined =>
  DeviceModule?.totalMemory?.();
export const getDeviceType = (): number | undefined =>
  DeviceModule?.deviceType?.();
export const getOsName = (): string | undefined => DeviceModule?.osName?.();
export const getOsVersion = (): string | undefined =>
  DeviceModule?.osVersion?.();
export const getOsBuildId = (): string | undefined =>
  DeviceModule?.osBuildId?.();
export const getOsInternalBuildId = (): string | undefined =>
  DeviceModule?.osInternalBuildId?.();
export const getOsBuildFingerprint = (): string | undefined =>
  DeviceModule?.osBuildFingerprint?.();
export const getPlatformApiLevel = (): number | undefined =>
  DeviceModule?.platformApiLevel?.();
export const getDeviceName = (): string | undefined =>
  DeviceModule?.deviceName?.();

// supportedCpuArchitectures requires an array type not yet supported by
// @lynx-js/autolink-codegen@0.4.1; revisit when array mappings land.
export const getSupportedCpuArchitectures = (): string[] | undefined =>
  undefined;
