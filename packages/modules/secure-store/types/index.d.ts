/** @lynxmodule */
export declare class SecureStoreModule {
  isAvailable(): boolean;
  setItemAsync(key: string, value: string): Promise<void>;
  getItemAsync(key: string): Promise<any>;
  deleteItemAsync(key: string): Promise<void>;
  isAvailableAsync(): Promise<boolean>;
}
