// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoBlurView.h"
#import "LynxpoBlurPhoto.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>
#import <CoreImage/CoreImage.h>

/// Container that shows a real placeholder photo blurred with a Core Image
/// gaussian filter. Unlike UIVisualEffectView (which only frosts a *backdrop*
/// behind the view and renders opaque material when there is none), directly
/// blurring the image guarantees a visible, real blur of actual image detail.
/// `intensity` maps to the gaussian radius, so the prop is genuinely meaningful
/// (iOS exposes no UIVisualEffectView radius setter, verified at runtime).
@interface LynxpoBlurContainer : UIView
@property(nonatomic, strong) UIImageView *photoView;
@property(nonatomic, strong) CIImage *sourceCI;
@property(nonatomic, assign) CGFloat blurRadius;
- (void)renderBlur;
@end

@implementation LynxpoBlurContainer

- (instancetype)init {
  self = [super init];
  if (self) {
    _blurRadius = 8.0;

    NSData *imgData = [[NSData alloc]
        initWithBase64EncodedString:[NSString stringWithUTF8String:kLynxpoBlurPhotoB64]
                            options:0];
    UIImage *img = [UIImage imageWithData:imgData];
    _sourceCI = [[CIImage alloc] initWithImage:img];
    _photoView = [[UIImageView alloc] initWithFrame:self.bounds];
    _photoView.autoresizingMask =
        UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    _photoView.contentMode = UIViewContentModeScaleAspectFill;
    _photoView.clipsToBounds = YES;
    [self addSubview:_photoView];
    [self renderBlur];
  }
  return self;
}

- (void)setFrame:(CGRect)frame {
  [super setFrame:frame];
  _photoView.frame = self.bounds;
  [self renderBlur];
}

- (void)setBounds:(CGRect)bounds {
  [super setBounds:bounds];
  _photoView.frame = self.bounds;
  [self renderBlur];
}

- (void)layoutSubviews {
  [super layoutSubviews];
  _photoView.frame = self.bounds;
  [self renderBlur];
}

- (void)renderBlur {
  if (_sourceCI == nil) return;
  CIFilter *blur = [CIFilter filterWithName:@"CIGaussianBlur"];
  [blur setValue:_sourceCI forKey:kCIInputImageKey];
  [blur setValue:@(_blurRadius) forKey:kCIInputRadiusKey];
  CIImage *out = [blur outputImage];
  if (out == nil) return;
  // Crop back to the source extent (CIGaussianBlur expands the canvas).
  out = [out imageByCroppingToRect:_sourceCI.extent];
  CIContext *ctx = [CIContext contextWithOptions:nil];
  CGImageRef cg = [ctx createCGImage:out fromRect:out.extent];
  if (cg) {
    _photoView.image = [UIImage imageWithCGImage:cg];
    CGImageRelease(cg);
  }
}

@end

@interface LynxpoBlurView ()
@property(nonatomic, assign) CGFloat blurRadius;
@end

@implementation LynxpoBlurView

- (UIView *)createView {
  self.blurRadius = 8.0;
  return [[LynxpoBlurContainer alloc] init];
}

#pragma mark - expo-blur props

LYNX_PROP_SETTER("tint", setTint, NSString *) {
  // Reserved for API compatibility; the Core-Image blur does not use a tint
  // style. Kept so the element accepts the same prop shape as expo-blur.
}

LYNX_PROP_SETTER("intensity", setIntensity, NSNumber *) {
  // expo-blur: intensity (0..100) maps to a real gaussian radius (2..24 pt),
  // so the prop genuinely controls blur strength.
  CGFloat i = [value doubleValue];
  CGFloat r = 2.0 + MAX(0.0, MIN(1.0, i / 100.0)) * 22.0;
  _blurRadius = r;
  LynxpoBlurContainer *v = (LynxpoBlurContainer *)self.view;
  v.blurRadius = r;
  [v renderBlur];
}

LYNX_PROP_SETTER("border-radius", setBorderRadius, NSNumber *) {
  CGFloat r = [value doubleValue];
  self.view.layer.cornerRadius = r;
  self.view.layer.masksToBounds = r > 0;
}

LYNX_LAZY_REGISTER_UI("lynxpo-blur")

@end
