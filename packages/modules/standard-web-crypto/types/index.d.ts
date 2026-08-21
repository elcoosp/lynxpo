/** @lynxmodule */
export declare class StandardWebCrypto {
  isAvailableAsync(): boolean;
  randomBytesAsync(length: string): string;
  digestAsync(algorithm: string, data: string): string;
}
