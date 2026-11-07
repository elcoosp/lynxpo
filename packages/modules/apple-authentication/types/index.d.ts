/** @lynxmodule */
export declare class AppleAuthentication {
  isAvailableAsync(): boolean;
  credentialAsync(
    options: string,
    cb: (result: Record<string, any>) => void,
  ): void;
  credentialStateAsync(user: string, cb: (result: string) => void): void;
}
