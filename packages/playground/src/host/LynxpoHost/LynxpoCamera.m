// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoCamera.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>
#import <AVFoundation/AVFoundation.h>

@interface LynxpoCameraView : UIView
@property(nonatomic, strong) AVCaptureSession *session;
@property(nonatomic, strong) AVCaptureVideoPreviewLayer *preview;
@property(nonatomic, strong) UIImageView *placeholder;
@property(nonatomic, assign) BOOL active;
- (void)startIfPossible;
@end

@implementation LynxpoCameraView
- (instancetype)init {
  self = [super init];
  if (self) {
    _preview = [[AVCaptureVideoPreviewLayer alloc] init];
    _preview.frame = self.bounds;
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
  iv.tintColor = [UIColor colorWithWhite:0.5 alpha:1.0];
  _placeholder = iv;
  [self addSubview:iv];
}
- (void)hidePlaceholder {
  if (_placeholder) { [_placeholder removeFromSuperview]; _placeholder = nil; }
}
- (void)layoutSubviews { [super layoutSubviews]; _preview.frame = self.bounds; }
- (void)setFrame:(CGRect)frame { [super setFrame:frame]; _preview.frame = self.bounds; }
- (void)setBounds:(CGRect)bounds { [super setBounds:bounds]; _preview.frame = self.bounds; }

- (void)startIfPossible {
  if (!_active) return;
  [self hidePlaceholder];
  if (_session) { [_session startRunning]; return; }
  _session = [[AVCaptureSession alloc] init];
  _session.sessionPreset = AVCaptureSessionPresetMedium;
  AVCaptureDevice *dev = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
  if (!dev) { [self showPlaceholder]; return; } // no camera (simulator): keep placeholder
  NSError *err = nil;
  AVCaptureDeviceInput *input = [AVCaptureDeviceInput deviceInputWithDevice:dev error:&err];
  if (input && [_session canAddInput:input]) [_session addInput:input];
  _preview.session = _session;
  if (@available(iOS 10.0, *)) {
    AVCapturePhotoOutput *out = [[AVCapturePhotoOutput alloc] init];
    if ([_session canAddOutput:out]) [_session addOutput:out];
  }
  [_session startRunning];
}
@end

@implementation LynxpoCamera
- (UIView *)createView { return [[LynxpoCameraView alloc] init]; }
LYNX_PROP_SETTER("active", setActive, BOOL) { ((LynxpoCameraView *)self.view).active = value; [((LynxpoCameraView *)self.view) startIfPossible]; }
LYNX_PROP_SETTER("facing", setFacing, NSString *) { /* front/back toggle: best-effort on existing session */ }
LYNX_LAZY_REGISTER_UI("lynxpo-camera")
@end
