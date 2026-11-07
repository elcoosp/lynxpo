/** @lynxmodule */
export declare class ImagePickerModule {
  getCameraPermissions(): any;
  getMediaLibraryPermissions(): any;
  getCameraPermissionsAsync(cb: (result: Record<string, any>) => void): void;
  getMediaLibraryPermissionsAsync(
    cb: (result: Record<string, any>) => void,
  ): void;
  launchImageLibraryAsync(cb: (result: Record<string, any>) => void): void;
  launchCameraAsync(cb: (result: Record<string, any>) => void): void;
}
