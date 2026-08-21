/** @lynxmodule */
export declare class ScreenOrientationModule {
  getOrientation(): number;
  getOrientationLock(): number;
  supportsOrientationLock(): boolean;
  getOrientationAsync(): any;
  getOrientationLockAsync(): any;
  lockAsync(orientation: number): any;
  unlockAsync(): any;
  lockPlatformAsync(orientation: number): any;
  supportsOrientationLockAsync(): any;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}
