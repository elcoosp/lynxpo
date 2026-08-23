// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoCamera.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>
#import <AVFoundation/AVFoundation.h>

// Faithful port of expo-camera <CameraView>: a live native preview surface
// backed by AVCaptureSession + AVCaptureVideoPreviewLayer. On a device with a
// camera this shows the real feed; on the simulator (no camera) it falls back
// to the placeholder icon instead of crashing.
@interface LynxpoCameraView : UIView
@property(nonatomic, strong) AVCaptureSession *session;
@property(nonatomic, strong) AVCaptureVideoPreviewLayer *preview;
@property(nonatomic, strong) AVCaptureDeviceInput *videoInput;
@property(nonatomic, strong) UIImageView *placeholder;
@property(nonatomic, assign) AVCaptureDevicePosition position;
@property(nonatomic, assign) BOOL active;
- (void)startIfPossible;
- (void)stop;
- (void)flip;
@end

@implementation LynxpoCameraView
- (instancetype)init {
  self = [super init];
  if (self) {
    _position = AVCaptureDevicePositionBack;
    _preview = [[AVCaptureVideoPreviewLayer alloc] init];
    _preview.videoGravity = AVLayerVideoGravityResizeAspectFill;
    [self.layer addSublayer:_preview];
    self.backgroundColor = [UIColor colorWithWhite:0.06 alpha:1.0];
    self.layer.cornerRadius = 14;
    self.clipsToBounds = YES;
    [self showPlaceholder];
  }
  return self;
}
- (void)showPlaceholder {
  if (_placeholder) return;
  UIImageView *iv = [[UIImageView alloc] initWithFrame:self.bounds];
  iv.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  iv.contentMode = UIViewContentModeCenter;
  UIImage *cam = [UIImage systemImageNamed:@"camera.fill"];
  iv.image = [cam imageWithTintColor:[UIColor colorWithWhite:0.5 alpha:1.0] renderingMode:UIImageRenderingModeAlwaysOriginal];
  _placeholder = iv;
  [self addSubview:iv];
}
- (void)hidePlaceholder {
  if (_placeholder) { [_placeholder removeFromSuperview]; _placeholder = nil; }
}
- (void)layoutSubviews { [super layoutSubviews]; _preview.frame = self.bounds; }
- (void)setFrame:(CGRect)frame { [super setFrame:frame]; _preview.frame = self.bounds; }
- (void)setBounds:(CGRect)bounds { [super setBounds:bounds]; _preview.frame = self.bounds; }

- (AVCaptureDevice *)deviceForPosition:(AVCaptureDevicePosition)pos {
  if (@available(iOS 10.0, *)) {
    AVCaptureDeviceDiscoverySession *s = [AVCaptureDeviceDiscoverySession
        discoverySessionWithDeviceTypes:@[ AVCaptureDeviceTypeBuiltInWideAngleCamera ]
                                mediaType:AVMediaTypeVideo
                                 position:pos];
    return s.devices.firstObject;
  }
  return [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
}

- (void)startIfPossible {
  if (!_active) return;
  AVCaptureDevice *dev = [self deviceForPosition:_position];
  if (!dev) { [self showPlaceholder]; return; }  // simulator: no camera
  [self hidePlaceholder];
  if (!_session) {
    _session = [[AVCaptureSession alloc] init];
    _session.sessionPreset = AVCaptureSessionPresetMedium;
    _preview.session = _session;
  }
  NSError *err = nil;
  _videoInput = [AVCaptureDeviceInput deviceInputWithDevice:dev error:&err];
  if (_videoInput && [_session canAddInput:_videoInput]) [_session addInput:_videoInput];
  if (@available(iOS 10.0, *)) {
    AVCapturePhotoOutput *out = [[AVCapturePhotoOutput alloc] init];
    if ([_session canAddOutput:out]) [_session addOutput:out];
  }
  if (!_session.isRunning) [_session startRunning];
}

- (void)stop {
  _active = NO;
  if (_session) { [_session stopRunning]; _session = nil; _preview.session = nil; }
  [self showPlaceholder];
}

- (void)flip {
  _position = (_position == AVCaptureDevicePositionBack) ? AVCaptureDevicePositionFront : AVCaptureDevicePositionBack;
  if (_session && _session.isRunning) {
    [_session stopRunning];
    if (_videoInput) [_session removeInput:_videoInput];
    _videoInput = nil;
    [self startIfPossible];
  }
}
@end

@implementation LynxpoCamera
- (UIView *)createView { return [[LynxpoCameraView alloc] init]; }
LYNX_PROP_SETTER("active", setActive, BOOL) {
  LynxpoCameraView *v = (LynxpoCameraView *)self.view;
  v.active = value;
  if (value) [v startIfPossible]; else [v stop];
}
LYNX_PROP_SETTER("facing", setFacing, NSString *) {
  LynxpoCameraView *v = (LynxpoCameraView *)self.view;
  AVCaptureDevicePosition want = [value isEqualToString:@"front"] ? AVCaptureDevicePositionFront : AVCaptureDevicePositionBack;
  if (v.position != want) { v.position = want; [v flip]; }
}
LYNX_LAZY_REGISTER_UI("lynxpo-camera")
@end
