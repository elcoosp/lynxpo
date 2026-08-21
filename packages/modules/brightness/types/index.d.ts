/** @lynxmodule */
export declare class BrightnessModule {
  getBrightness(): number;
  getSystemBrightness(): number;
  isUsingSystemBrightness(): boolean;
  getSystemBrightnessMode(): number;
  getBrightnessAsync(): any;
  setBrightnessAsync(value: number): any;
  getSystemBrightnessAsync(): any;
  isUsingSystemBrightnessAsync(): any;
  getSystemBrightnessModeAsync(): any;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}
