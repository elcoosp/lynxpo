// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "CameraModule.h"
#import <AVFoundation/AVFoundation.h>

// Shared capture session state for the live preview, faithful to Expo CameraView.
@interface CameraModule () <AVCapturePhotoCaptureDelegate>
@property (nonatomic, strong) AVCaptureSession *session;
@property (nonatomic, strong) AVCaptureDeviceInput *videoInput;
@property (nonatomic, strong) AVCaptureVideoDataOutput *videoOutput;
@property (nonatomic, strong) AVCapturePhotoOutput *photoOutput;
@property (nonatomic, strong) dispatch_queue_t sessionQueue;
@property (nonatomic, assign) AVCaptureDevicePosition position;
// captureFrame synchronization
@property (nonatomic, strong) dispatch_semaphore_t captureSem;
@property (nonatomic, copy) NSString *capturedBase64;
@end

@implementation CameraModule



- (instancetype)init {
  self = [super init];
  if (self) {
    _position = AVCaptureDevicePositionBack;
    _sessionQueue = dispatch_queue_create("lynxpo.camera.queue", DISPATCH_QUEUE_SERIAL);
  }
  return self;
}

- (id)cameraPermissionsAsync {
  AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
  BOOL granted = (status == AVAuthorizationStatusAuthorized);
  NSString *statusStr = granted ? @"granted" : (status == AVAuthorizationStatusDenied ? @"denied" : @"undetermined");
  return @{ @"status" : statusStr, @"granted" : @(granted), @"canAskAgain" : @(status != AVAuthorizationStatusDenied) };
}

- (id)microphonePermissionsAsync {
  AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeAudio];
  BOOL granted = (status == AVAuthorizationStatusAuthorized);
  NSString *statusStr = granted ? @"granted" : (status == AVAuthorizationStatusDenied ? @"denied" : @"undetermined");
  return @{ @"status" : statusStr, @"granted" : @(granted), @"canAskAgain" : @(status != AVAuthorizationStatusDenied) };
}

- (void)requestCameraPermission {
  AVAuthorizationStatus status = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
  if (status == AVAuthorizationStatusAuthorized) return;
  [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
    // The next startCamera() attempt (driven by the JS retry loop) opens the session.
  }];
}

- (id)availableCameraTypes {
  NSMutableArray *types = [NSMutableArray array];
  for (AVCaptureDevice *device in [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo]) {
    if (device.position == AVCaptureDevicePositionFront) {
      if (![types containsObject:@"front"]) [types addObject:@"front"];
    } else if (device.position == AVCaptureDevicePositionBack) {
      if (![types containsObject:@"back"]) [types addObject:@"back"];
    }
  }
  return types;
}

- (id)availableVideoCodecs {
  return @[ @"avc", @"hevc", @"jpeg", @"h264" ];
}

- (BOOL)startCamera {
  if (self.session && self.session.isRunning) return YES;
  self.session = [[AVCaptureSession alloc] init];
  self.session.sessionPreset = AVCaptureSessionPresetMedium;
  AVCaptureDevice *device = [self deviceForPosition:self.position];
  if (!device) return NO;
  NSError *error = nil;
  self.videoInput = [[AVCaptureDeviceInput alloc] initWithDevice:device error:&error];
  if (error || !self.videoInput) return NO;
  if ([self.session canAddInput:self.videoInput]) [self.session addInput:self.videoInput];
  self.photoOutput = [[AVCapturePhotoOutput alloc] init];
  if ([self.session canAddOutput:self.photoOutput]) [self.session addOutput:self.photoOutput];
  [self.session startRunning];
  return YES;
}

- (void)stopCamera {
  if (self.session) {
    [self.session stopRunning];
    self.session = nil;
  }
}

- (void)flipCamera {
  self.position = (self.position == AVCaptureDevicePositionBack)
      ? AVCaptureDevicePositionFront
      : AVCaptureDevicePositionBack;
  if (self.session && self.session.isRunning) {
    [self.session stopRunning];
    [self.session removeInput:self.videoInput];
    AVCaptureDevice *device = [self deviceForPosition:self.position];
    if (device) {
      NSError *error = nil;
      self.videoInput = [[AVCaptureDeviceInput alloc] initWithDevice:device error:&error];
      if (!error && [self.session canAddInput:self.videoInput]) [self.session addInput:self.videoInput];
    }
    [self.session startRunning];
  }
}

- (void)setTorch:(BOOL)enabled {
  AVCaptureDevice *device = [self deviceForPosition:self.position];
  if (device && [device hasTorch] && [device isTorchAvailable]) {
    [device lockForConfiguration:nil];
    [device setTorchMode:enabled ? AVCaptureTorchModeOn : AVCaptureTorchModeOff];
    [device unlockForConfiguration];
  }
}

- (BOOL)isTorchAvailable {
  AVCaptureDevice *device = [self deviceForPosition:self.position];
  return device && [device hasTorch] && [device isTorchAvailable];
}

- (NSString *)captureFrame {
  // A faithful CameraView exposes the live preview through a layer, not a per-frame
  // bridge pull. On iOS we capture a still JPEG from the session as the frame sample.
  if (!self.session || !self.photoOutput) return @"";
  self.captureSem = dispatch_semaphore_create(0);
  self.capturedBase64 = @"";
  AVCapturePhotoSettings *settings = [AVCapturePhotoSettings photoSettings];
  [self.photoOutput capturePhotoWithSettings:settings delegate:self];
  dispatch_semaphore_wait(self.captureSem, dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)));
  return self.capturedBase64;
}

- (void)photoOutput:(AVCapturePhotoOutput *)output
    didFinishProcessingPhoto:(AVCapturePhoto *)photo
                      error:(NSError *)error {
  if (!error) {
    NSData *data = [photo fileDataRepresentation];
    if (data) self.capturedBase64 = [data base64EncodedStringWithOptions:0];
  }
  if (self.captureSem) dispatch_semaphore_signal(self.captureSem);
}

- (AVCaptureDevice *)deviceForPosition:(AVCaptureDevicePosition)position {
  if (@available(iOS 10.0, *)) {
    AVCaptureDeviceDiscoverySession *session = [AVCaptureDeviceDiscoverySession
        discoverySessionWithDeviceTypes:@[ AVCaptureDeviceTypeBuiltInWideAngleCamera ]
                                mediaType:AVMediaTypeVideo
                                 position:position];
    return session.devices.firstObject;
  }
  return nil;
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"availableCameraTypes" : NSStringFromSelector(@selector(availableCameraTypes)),
    @"availableVideoCodecs" : NSStringFromSelector(@selector(availableVideoCodecs)),
    @"cameraPermissionsAsync" : NSStringFromSelector(@selector(cameraPermissionsAsync)),
    @"captureFrame" : NSStringFromSelector(@selector(captureFrame)),
    @"flipCamera" : NSStringFromSelector(@selector(flipCamera)),
    @"isTorchAvailable" : NSStringFromSelector(@selector(isTorchAvailable)),
    @"microphonePermissionsAsync" : NSStringFromSelector(@selector(microphonePermissionsAsync)),
    @"requestCameraPermission" : NSStringFromSelector(@selector(requestCameraPermission)),
    @"setTorch" : NSStringFromSelector(@selector(setTorch)),
    @"startCamera" : NSStringFromSelector(@selector(startCamera)),
    @"stopCamera" : NSStringFromSelector(@selector(stopCamera)),
  };
}
@end
