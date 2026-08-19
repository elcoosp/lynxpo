// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `CameraModule`. Exposes camera availability + live-preview
/// control to JS via `NativeModules.CameraModule`, faithfully porting Expo's `expo-camera`
/// native method surface (including the CameraView-style start/stop/flip/torch/captureFrame
/// control surface used by the `CameraPreview` custom Lynx UI component).
@interface CameraModule : NSObject <LynxModule>

- (NSDictionary<NSString *, id> *)cameraPermissionsAsync;
- (NSDictionary<NSString *, id> *)microphonePermissionsAsync;
- (void)requestCameraPermission;
- (NSArray<NSString *> *)availableCameraTypes;
- (NSArray<NSString *> *)availableVideoCodecs;
- (BOOL)startCamera;
- (void)stopCamera;
- (void)flipCamera;
- (void)setTorch:(BOOL)enabled;
- (BOOL)isTorchAvailable;
- (NSString *)captureFrame;
@end

NS_ASSUME_NONNULL_END
