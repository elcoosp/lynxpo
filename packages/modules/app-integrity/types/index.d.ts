/** @lynxmodule */
export declare class AppIntegrity {
  isAvailableAsync(): boolean;
  integrityTokenAsync(
    options: string,
    cb: (result: Record<string, any>) => void,
  ): void;
  codeHashAsync(): any;
}
