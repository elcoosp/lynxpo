// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoMeshGradient.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>

@interface LynxpoMeshGradientView : UIView
@property(nonatomic, strong) CAGradientLayer *fallback;
@property(nonatomic, copy) NSArray<NSString *> *colors;
- (void)applyFallback;
+ (UIColor *)colorFromHex:(NSString *)hex;
@end

@implementation LynxpoMeshGradientView
- (instancetype)init {
  self = [super init];
  if (self) {
    _fallback = [CAGradientLayer layer];
    _fallback.frame = self.bounds;
    _fallback.startPoint = CGPointMake(0, 0);
    _fallback.endPoint = CGPointMake(1, 1);
    [self.layer addSublayer:_fallback];
    _colors = @[@"#ff0080", @"#7928ca", @"#00ebeb"];
    [self applyFallback];
  }
  return self;
}
- (void)layoutSubviews { [super layoutSubviews]; _fallback.frame = self.bounds; }
- (void)setFrame:(CGRect)frame { [super setFrame:frame]; _fallback.frame = self.bounds; }
- (void)setBounds:(CGRect)bounds { [super setBounds:bounds]; _fallback.frame = self.bounds; }

+ (UIColor *)colorFromHex:(NSString *)hex {
  NSString *s = [hex stringByReplacingOccurrencesOfString:@"#" withString:@""];
  if (s.length == 3) s = [NSString stringWithFormat:@"%@%@%@%@%@%@",[s substringWithRange:NSMakeRange(0,1)],[s substringWithRange:NSMakeRange(0,1)],[s substringWithRange:NSMakeRange(1,1)],[s substringWithRange:NSMakeRange(1,1)],[s substringWithRange:NSMakeRange(2,1)],[s substringWithRange:NSMakeRange(2,1)]];
  if (s.length == 6) s = [s stringByAppendingString:@"ff"];
  if (s.length != 8) return [UIColor blackColor];
  unsigned int rgba = 0; [[NSScanner scannerWithString:s] scanHexInt:&rgba];
  return [UIColor colorWithRed:((rgba & 0x00ff0000) >> 16)/255.0 green:((rgba & 0x0000ff00) >> 8)/255.0 blue:(rgba & 0x000000ff)/255.0 alpha:((rgba & 0xff000000) >> 24)/255.0];
}

- (void)applyFallback {
  if (!_colors.count) return;
  NSMutableArray *cg = [NSMutableArray arrayWithCapacity:_colors.count];
  NSMutableArray *locs = [NSMutableArray arrayWithCapacity:_colors.count];
  for (NSUInteger i = 0; i < _colors.count; i++) {
    [cg addObject:(__bridge id)[LynxpoMeshGradientView colorFromHex:_colors[i]].CGColor];
    [locs addObject:@((double)i / MAX(1, (double)(_colors.count - 1)))];
  }
  _fallback.colors = cg;
  _fallback.locations = locs;
}
@end

@implementation LynxpoMeshGradient
- (UIView *)createView { return [[LynxpoMeshGradientView alloc] init]; }

LYNX_PROP_SETTER("colors", setColors, NSArray<NSString *> *) {
  if (value.count) ((LynxpoMeshGradientView *)self.view).colors = value;
  [((LynxpoMeshGradientView *)self.view) applyFallback];
}
LYNX_PROP_SETTER("points", setPoints, NSArray *) { /* mesh geometry: used natively on iOS 18+; fallback ignores */ }
LYNX_PROP_SETTER("columns", setColumns, NSInteger) { /* mesh geometry */ }
LYNX_PROP_SETTER("rows", setRows, NSInteger) { /* mesh geometry */ }
LYNX_PROP_SETTER("smooths-colors", setSmoothsColors, BOOL) { /* mesh geometry */ }

LYNX_LAZY_REGISTER_UI("lynxpo-mesh-gradient")
@end
