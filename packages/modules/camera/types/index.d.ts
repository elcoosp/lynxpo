/** @lynxmodule */
export declare class CameraModule {
  cameraPermissionsAsync(): any;
  requestCameraPermission(): void;
  microphonePermissionsAsync(): any;
  availableCameraTypes(): any;
  availableVideoCodecs(): any;
  startCamera(): boolean;
  stopCamera(): void;
  flipCamera(): void;
  setTorch(enabled: boolean): void;
  isTorchAvailable(): boolean;
  captureFrame(): string;
}
