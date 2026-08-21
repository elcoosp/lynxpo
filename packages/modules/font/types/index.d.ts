/** @lynxmodule */
export declare class FontModule {
  isLoaded(fontFamily: string): boolean;
  loadedFonts(): any;
  processFontFamily(fontFamily: string): string;
  loadAsync(fontFamily: string): void;
}
