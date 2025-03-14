/**
 * Generated TypeScript definitions from Swift code
 * Module: DeviceModule
 */

/**
 * DeviceModule superdoc
 */
/**
 * DeviceType superdoc
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
export function isDevice(): Boolean;

export function brand(): String;

export function manufacturer(): String;

export function modelName(): String;

export function designName(): String;

export function productName(): String;

export function totalMemory(): Long;

export function deviceType(): DeviceType;

export function supportedCpuArchitectures(): Array<String> | null;

export function osName(): String;

export function osVersion(): String;

export function osBuildId(): String;

export function osInternalBuildId(): String;

export function osBuildFingerprint(): String;

export function platformApiLevel(): Int;

export function deviceName(): String;

