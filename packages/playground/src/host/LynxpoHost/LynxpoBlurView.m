// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoBlurView.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>

/// Container view: a UIVisualEffectView pinned to the back, children added on
/// top by the engine (it inserts subviews into self.view).
@interface LynxpoBlurContainer : UIView
@property(nonatomic, strong) UIVisualEffectView *blurEffectView;
@end

@implementation LynxpoBlurContainer

- (instancetype)init {
  self = [super init];
  if (self) {
    _blurEffectView = [[UIVisualEffectView alloc] initWithEffect:nil];
    _blurEffectView.frame = self.bounds;
    _blurEffectView.autoresizingMask =
        UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [self addSubview:_blurEffectView];
  }
  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  _blurEffectView.frame = self.bounds;
}

@end

@implementation LynxpoBlurView

- (UIView *)createView {
  return [[LynxpoBlurContainer alloc] init];
}

#pragma mark - expo-blur props

LYNX_PROP_SETTER("tint", setTint, NSString *) {
  UIBlurEffectStyle style = UIBlurEffectStyleRegular;
  NSString *t = [value lowercaseString];
  if ([t isEqualToString:@"light"]) style = UIBlurEffectStyleLight;
  else if ([t isEqualToString:@"dark"]) style = UIBlurEffectStyleDark;
  else if ([t isEqualToString:@"extralight"] || [t isEqualToString:@"default"])
    style = UIBlurEffectStyleExtraLight;
  else if ([t isEqualToString:@"prominent"]) style = UIBlurEffectStyleProminent;
  else if ([t isEqualToString:@"systemmaterial"])
    style = UIBlurEffectStyleSystemMaterial;
  else if ([t isEqualToString:@"systemthinmaterial"])
    style = UIBlurEffectStyleSystemThinMaterial;
  else if ([t isEqualToString:@"systemthickmaterial"])
    style = UIBlurEffectStyleSystemThickMaterial;
  else if ([t isEqualToString:@"systemultrathinmaterial"])
    style = UIBlurEffectStyleSystemUltraThinMaterial;
  LynxpoBlurContainer *v = (LynxpoBlurContainer *)self.view;
  v.blurEffectView.effect = [UIBlurEffect effectWithStyle:style];
}

LYNX_PROP_SETTER("intensity", setIntensity, NSNumber *) {
  // expo-blur approximates intensity on iOS by adjusting the blur view alpha.
  CGFloat i = [value doubleValue];
  CGFloat a = MAX(0.0, MIN(1.0, i / 100.0));
  self.view.alpha = a > 0 ? a : 1.0;
}

LYNX_PROP_SETTER("border-radius", setBorderRadius, NSNumber *) {
  CGFloat r = [value doubleValue];
  self.view.layer.cornerRadius = r;
  self.view.layer.masksToBounds = r > 0;
}

LYNX_LAZY_REGISTER_UI("blur-view")

@end
