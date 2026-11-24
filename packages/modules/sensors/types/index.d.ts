/** @lynxmodule */
export declare class SensorsModule {
  getAccelerometer(): any;
  getGyroscope(): any;
  isAvailable(): boolean;
  getAccelerometerAsync(): Promise<any>;
  getGyroscopeAsync(): Promise<any>;
  isAvailableAsync(): Promise<boolean>;
}
