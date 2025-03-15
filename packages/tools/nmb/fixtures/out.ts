/**
 * Generated TypeScript definitions from Lynx Native Module : DeviceModule
 */

/**
 * DeviceModule superdoc
 */

export enum DeviceType {
  /**
   * DeviceType.UNKNOWN field superdoc
   */
  UNKNOWN = 0,
  PHONE = 1,
  TABLET = 2,
  DESKTOP = 3,
  TV = 4,
}

/**
 * Is it a device ? superdoc
 */
export function isDevice(): boolean {}
export function brand(): string {}
export function manufacturer(): string {}
export function modelName(): string {}
export function designName(): string {}
export function productName(): string {}
export function totalMemory(): number {}
export function deviceType(): DeviceType {}
export function supportedCpuArchitectures(): string[] | null {}
export function osName(): string {}
export function osVersion(): string {}
export function osBuildId(): string {}
export function osInternalBuildId(): string {}
export function osBuildFingerprint(): string {}
export function platformApiLevel(): number {}
export function deviceName(): string {}
