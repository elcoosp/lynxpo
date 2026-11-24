/** @lynxmodule */
export declare class ScreenOrientationModule {
  getOrientation(): number;
  getOrientationLock(): number;
  supportsOrientationLock(): boolean;
  getOrientationAsync(): Promise<void>;
  getOrientationLockAsync(): Promise<void>;
  lockAsync(orientation: number): Promise<void>;
  unlockAsync(): Promise<void>;
  lockPlatformAsync(orientation: number): Promise<void>;
  supportsOrientationLockAsync(): Promise<void>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}
