/** @lynxmodule */
export declare class SecureStoreModule {
  isAvailable(): boolean;
  setItemAsync(key: string, value: string): any;
  getItemAsync(key: string): any;
  deleteItemAsync(key: string): any;
  isAvailableAsync(): any;
}
