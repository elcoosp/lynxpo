/** @lynxmodule */
export declare class LivePhoto {
  isAvailableAsync(): Promise<boolean>;
  isLivePhotoAsync(path: string): Promise<boolean>;
  saveLivePhotoAsync(video: string, photo: string): Promise<boolean>;
}
