/** @lynxmodule */
export declare class NetworkModule {
  getIpAddress(): string | null;
  getNetworkState(): any;
  getIpAddressAsync(): any;
  getNetworkStateAsync(): any;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}
