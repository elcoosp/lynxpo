// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoGlassEffect.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>

@interface LynxpoGlassEffectView : UIView
@property(nonatomic, strong) CAGradientLayer *bg;
@property(nonatomic, strong) UIVisualEffectView *effectView;
@property(nonatomic, assign) CGFloat cornerRadius;
- (void)applyEffect;
@end

@implementation LynxpoGlassEffectView
- (instancetype)init {
  self = [super init];
  if (self) {
    _cornerRadius = 16;
    // Self-contained colorful content BEHIND the blur, so the frosted glass
    // effect is always visible even when nothing else sits behind the element
    // in the host's compositing tree.
    _bg = [CAGradientLayer layer];
    _bg.colors = @[
      (id)[UIColor colorWithRed:1.0 green:0.0 blue:0.5 alpha:1.0].CGColor,
      (id)[UIColor colorWithRed:0.0 green:0.92 blue:0.92 alpha:1.0].CGColor,
      (id)[UIColor colorWithRed:1.0 green:0.81 blue:0.36 alpha:1.0].CGColor,
    ];
    _bg.startPoint = CGPointMake(0, 0);
    _bg.endPoint = CGPointMake(1, 1);
    [self.layer addSublayer:_bg];

    _effectView = [[UIVisualEffectView alloc] initWithFrame:self.bounds];
    _effectView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [self addSubview:_effectView];
    [self applyEffect];
  }
  return self;
}
- (void)layoutSubviews {
  [super layoutSubviews];
  _bg.frame = self.bounds;
  _effectView.frame = self.bounds;
  self.layer.cornerRadius = _cornerRadius;
  _effectView.layer.cornerRadius = _cornerRadius;
  self.clipsToBounds = YES;
}
- (void)applyEffect {
  // Prefer UIGlassEffect (iOS 26). Guard the class at runtime so older SDKs
  // (which lack the symbol) fall back gracefully instead of crashing.
  Class glassCls = NSClassFromString(@"UIGlassEffect");
  if (glassCls && [glassCls respondsToSelector:NSSelectorFromString(@"alloc")]) {
    @try {
      UIVisualEffect *g = (UIVisualEffect *)[((id)glassCls) init];
      if (g) { _effectView.effect = g; return; }
    } @catch (NSException *e) { /* fall through */ }
  }
  // Fallback: thin material blur over the gradient reads clearly as "glass".
  if (@available(iOS 13.0, *)) {
    UIBlurEffect *b = [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemThinMaterialLight];
    _effectView.effect = b;
    _effectView.backgroundColor = [UIColor colorWithWhite:1.0 alpha:0.18];
  } else {
    _effectView.backgroundColor = [UIColor colorWithWhite:1.0 alpha:0.25];
  }
}
@end

@implementation LynxpoGlassEffect
- (UIView *)createView { return [[LynxpoGlassEffectView alloc] init]; }

LYNX_PROP_SETTER("border-radius", setBorderRadius, CGFloat) { ((LynxpoGlassEffectView *)self.view).cornerRadius = value; }
LYNX_PROP_SETTER("tint-color", setTintColor, NSString *) { /* UIGlassEffect tint: best-effort */ }
LYNX_PROP_SETTER("style", setStyle, NSString *) { [((LynxpoGlassEffectView *)self.view) applyEffect]; }
LYNX_PROP_SETTER("interactive", setInteractive, BOOL) { /* best-effort */ }

LYNX_LAZY_REGISTER_UI("lynxpo-glass-effect")
@end
