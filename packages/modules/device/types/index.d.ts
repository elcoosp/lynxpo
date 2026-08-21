/** @lynxmodule */
export declare class DeviceModule {
  /** Whether the app runs on a physical device (false on simulator/emulator). */
  isDevice(): boolean;
  /** Device brand, e.g. "Apple" or "Google". */
  brand(): string;
  /** Device manufacturer. */
  manufacturer(): string;
  /** Device model name, e.g. "iPhone17,4". */
  modelName(): string;
  /** Internal design name. */
  designName(): string;
  /** Product name. */
  productName(): string;
  /** Approximate device-year class. */
  deviceYearClass(): number;
  /** Total physical memory in bytes. */
  totalMemory(): number;
  /** Device form factor (1 = phone, 2 = tablet, 3 = desktop, 4 = TV). */
  deviceType(): number;
  /** OS name, e.g. "iOS" / "Android". */
  osName(): string;
  /** OS version string. */
  osVersion(): string;
  /** OS build id. */
  osBuildId(): string;
  /** OS internal build id. */
  osInternalBuildId(): string;
  /** OS build fingerprint. */
  osBuildFingerprint(): string;
  /** Platform API level (Android SDK int / iOS major version). */
  platformApiLevel(): number;
  /** User-facing device name. */
  deviceName(): string;
}
