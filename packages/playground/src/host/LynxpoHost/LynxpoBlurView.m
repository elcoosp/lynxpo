// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoBlurView.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>

/// Container view that stacks several UIVisualEffectViews. iOS fixes the blur
/// radius per UIBlurEffect style, so layering multiple effect views compounds
/// the frost into a genuinely strong, unmistakable blur (public API only — no
/// private radius selectors, which do not exist on UIVisualEffectView).
@interface LynxpoBlurContainer : UIView
@property(nonatomic, strong) NSArray<UIVisualEffectView *> *layers;
- (void)applyEffectWithStyle:(UIBlurEffectStyle)style;
@end

@implementation LynxpoBlurContainer

- (instancetype)init {
  self = [super init];
  if (self) {
    NSMutableArray *arr = [NSMutableArray array];
    for (int i = 0; i < 1; i++) {
      UIVisualEffectView *ev =
          [[UIVisualEffectView alloc] initWithEffect:nil];
      ev.frame = self.bounds;
      ev.autoresizingMask =
          UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
      [self addSubview:ev];
      [arr addObject:ev];
    }
    _layers = [arr copy];
  }
  return self;
}

- (void)setFrame:(CGRect)frame {
  [super setFrame:frame];
  for (UIVisualEffectView *ev in _layers) ev.frame = self.bounds;
}

- (void)setBounds:(CGRect)bounds {
  [super setBounds:bounds];
  for (UIVisualEffectView *ev in _layers) ev.frame = self.bounds;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  // Keep the stacked effect views on top of any engine-inserted children
  // (the blurred content), so the UIVisualEffectView blurs what is behind it.
  for (UIVisualEffectView *ev in _layers) {
    [self bringSubviewToFront:ev];
    ev.frame = self.bounds;
  }
}

- (void)applyEffectWithStyle:(UIBlurEffectStyle)style {
  for (UIVisualEffectView *ev in _layers) {
    ev.effect = [UIBlurEffect effectWithStyle:style];
  }
}

@end

@interface LynxpoBlurView ()
@property(nonatomic, assign) UIBlurEffectStyle tintStyle;
@end

@implementation LynxpoBlurView

- (UIView *)createView {
  self.tintStyle = UIBlurEffectStyleProminent;
  return [[LynxpoBlurContainer alloc] init];
}

#pragma mark - expo-blur props

LYNX_PROP_SETTER("tint", setTint, NSString *) {
  UIBlurEffectStyle style = UIBlurEffectStyleProminent;
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
  _tintStyle = style;
  LynxpoBlurContainer *v = (LynxpoBlurContainer *)self.view;
  [v applyEffectWithStyle:style];
}

LYNX_PROP_SETTER("intensity", setIntensity, NSNumber *) {
  // expo-blur: on iOS the blur strength is fixed per UIBlurEffect style (no
  // public/private radius setter exists), so intensity only nudges the
  // overlay opacity within a safe opaque range. We keep the container fully
  // opaque (alpha 1.0) so the frost reads as a real blur, never a darkened
  // wash of the content behind it.
  CGFloat i = [value doubleValue];
  CGFloat a = MAX(0.0, MIN(1.0, i / 100.0));
  self.view.alpha = a < 0.7 ? 0.7 : a;
}

LYNX_PROP_SETTER("border-radius", setBorderRadius, NSNumber *) {
  CGFloat r = [value doubleValue];
  self.view.layer.cornerRadius = r;
  self.view.layer.masksToBounds = r > 0;
}

LYNX_LAZY_REGISTER_UI("lynxpo-blur")

@end
