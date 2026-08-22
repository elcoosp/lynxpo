// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoLinearGradient.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>

@interface LynxpoLinearGradientView : UIView
@property(nonatomic, strong) CAGradientLayer *gradientLayer;
@end

@implementation LynxpoLinearGradientView
- (instancetype)init {
  self = [super init];
  if (self) {
    _gradientLayer = [CAGradientLayer layer];
    _gradientLayer.frame = self.bounds;
    [self.layer addSublayer:_gradientLayer];
  }
  return self;
}
- (void)layoutSubviews {
  [super layoutSubviews];
  _gradientLayer.frame = self.bounds;
}
@end

@implementation LynxpoLinearGradient

- (UIView *)createView {
  return [[LynxpoLinearGradientView alloc] init];
}

#pragma mark - prop setters (expo-linear-gradient surface)

LYNX_PROP_SETTER("colors", setColors, NSArray<NSString *> *) {
  if (!value.count) return;
  NSMutableArray *cgColors = [NSMutableArray arrayWithCapacity:value.count];
  for (NSString *c in value) {
    [cgColors addObject:(__bridge id)[LynxpoLinearGradient colorFromHex:c].CGColor];
  }
  ((LynxpoLinearGradientView *)self.view).gradientLayer.colors = cgColors;
}

LYNX_PROP_SETTER("locations", setLocations, NSArray<NSNumber *> *) {
  if (!value.count) return;
  NSMutableArray *locs = [NSMutableArray arrayWithCapacity:value.count];
  for (NSNumber *n in value) {
    [locs addObject:n];
  }
  ((LynxpoLinearGradientView *)self.view).gradientLayer.locations = locs;
}

LYNX_PROP_SETTER("start", setStart, NSDictionary *) {
  NSNumber *x = value[@"x"] ?: @0.5;
  NSNumber *y = value[@"y"] ?: @0.0;
  ((LynxpoLinearGradientView *)self.view).gradientLayer.startPoint =
      CGPointMake([x doubleValue], [y doubleValue]);
}

LYNX_PROP_SETTER("end", setEnd, NSDictionary *) {
  NSNumber *x = value[@"x"] ?: @0.5;
  NSNumber *y = value[@"y"] ?: @1.0;
  ((LynxpoLinearGradientView *)self.view).gradientLayer.endPoint =
      CGPointMake([x doubleValue], [y doubleValue]);
}

#pragma mark - helpers

+ (UIColor *)colorFromHex:(NSString *)hex {
  NSString *s = [hex stringByReplacingOccurrencesOfString:@"#" withString:@""];
  if (s.length == 3) {
    NSString *r = [s substringWithRange:NSMakeRange(0, 1)];
    NSString *g = [s substringWithRange:NSMakeRange(1, 1)];
    NSString *b = [s substringWithRange:NSMakeRange(2, 1)];
    s = [NSString stringWithFormat:@"%@%@%@%@%@%@", r, r, g, g, b, b];
  }
  if (s.length == 6) s = [s stringByAppendingString:@"ff"];
  if (s.length != 8) return [UIColor blackColor];
  unsigned int rgba = 0;
  [[NSScanner scannerWithString:s] scanHexInt:&rgba];
  CGFloat a = ((rgba & 0xff000000) >> 24) / 255.0;
  CGFloat r = ((rgba & 0x00ff0000) >> 16) / 255.0;
  CGFloat g = ((rgba & 0x0000ff00) >> 8) / 255.0;
  CGFloat b = (rgba & 0x000000ff) / 255.0;
  return [UIColor colorWithRed:r green:g blue:b alpha:a];
}

LYNX_LAZY_REGISTER_UI("linear-gradient")

@end
