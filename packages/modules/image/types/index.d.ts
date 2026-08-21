/** @lynxmodule */
export declare class Image {
  getCacheSize(): number;
  clearCache(): void;
  prefetch(url: string): boolean;
  isImageLoading(uri: string): boolean;
  cancelLoading(uri: string): void;
}
