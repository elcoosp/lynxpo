/** @lynxmodule */
export declare class CryptoModule {
  getRandomBytes(byteCount: number): string | null;
  randomUUID(): string | null;
  getRandomBytesAsync(byteCount: number): any;
  digestString(
    algorithm: string,
    data: string,
    encoding: string,
  ): string | null;
  digestStringAsync(algorithm: string, data: string, encoding: string): any;
}
