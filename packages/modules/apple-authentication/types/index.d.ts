/** @lynxmodule */
export declare class AppleAuthentication {
  isAvailableAsync(): boolean;
  credentialAsync(options: string): any;
  credentialStateAsync(user: string): string;
}
