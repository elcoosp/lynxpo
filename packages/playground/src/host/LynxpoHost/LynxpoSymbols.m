// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoSymbols.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>

@interface LynxpoSymbolsView : UIView
@property(nonatomic, strong) UIImageView *imageView;
@property(nonatomic, copy) NSString *name;
@property(nonatomic, copy) NSString *weight;   // ultralight..black
@property(nonatomic, copy) NSString *scale;    // small/default/large
@property(nonatomic, copy) NSString *symbolType; // monochrome/hierarchical/palette/multicolor
@property(nonatomic, copy) NSString *tint;     // hex
@property(nonatomic, assign) CGFloat pointSize;
@end

@implementation LynxpoSymbolsView
- (instancetype)init {
  self = [super init];
  if (self) {
    _imageView = [[UIImageView alloc] initWithFrame:self.bounds];
    _imageView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    _imageView.contentMode = UIViewContentModeScaleAspectFit;
    _name = @"star.fill";
    _weight = @"regular";
    _scale = @"default";
    _symbolType = @"monochrome";
    _pointSize = 40;
    [self addSubview:_imageView];
    [self reload];
  }
  return self;
}
- (void)layoutSubviews { [super layoutSubviews]; _imageView.frame = self.bounds; }
- (void)setFrame:(CGRect)frame { [super setFrame:frame]; _imageView.frame = self.bounds; }
- (void)setBounds:(CGRect)bounds { [super setBounds:bounds]; _imageView.frame = self.bounds; }

+ (UIColor *)colorFromHex:(NSString *)hex {
  NSString *s = [hex stringByReplacingOccurrencesOfString:@"#" withString:@""];
  if (s.length == 3) {
    s = [NSString stringWithFormat:@"%@%@%@%@%@%@",
         [s substringWithRange:NSMakeRange(0,1)], [s substringWithRange:NSMakeRange(0,1)],
         [s substringWithRange:NSMakeRange(1,1)], [s substringWithRange:NSMakeRange(1,1)],
         [s substringWithRange:NSMakeRange(2,1)], [s substringWithRange:NSMakeRange(2,1)]];
  }
  if (s.length == 6) s = [s stringByAppendingString:@"ff"];
  if (s.length != 8) return nil;
  unsigned int rgba = 0;
  [[NSScanner scannerWithString:s] scanHexInt:&rgba];
  return [UIColor colorWithRed:((rgba & 0x00ff0000) >> 16)/255.0
                           green:((rgba & 0x0000ff00) >> 8)/255.0
                            blue:(rgba & 0x000000ff)/255.0
                           alpha:((rgba & 0xff000000) >> 24)/255.0];
}

- (UIImageSymbolWeight)wg {
  NSDictionary *m = @{@"ultralight":@(UIImageSymbolWeightUltraLight),
                      @"thin":@(UIImageSymbolWeightThin),
                      @"light":@(UIImageSymbolWeightLight),
                      @"regular":@(UIImageSymbolWeightRegular),
                      @"medium":@(UIImageSymbolWeightMedium),
                      @"semibold":@(UIImageSymbolWeightSemibold),
                      @"bold":@(UIImageSymbolWeightBold),
                      @"heavy":@(UIImageSymbolWeightHeavy),
                      @"black":@(UIImageSymbolWeightBlack)};
  NSNumber *w = m[_weight.lowercaseString];
  return w ? (UIImageSymbolWeight)w.intValue : UIImageSymbolWeightRegular;
}
- (UIImageSymbolScale)sc {
  if ([_scale.lowercaseString isEqualToString:@"small"]) return UIImageSymbolScaleSmall;
  if ([_scale.lowercaseString isEqualToString:@"large"]) return UIImageSymbolScaleLarge;
  return UIImageSymbolScaleDefault;
}

- (void)reload {
  if (_name.length == 0) return;
  UIImage *img = [UIImage systemImageNamed:_name];
  if (!img) { _imageView.image = nil; return; }
  // iOS 13+ core config (deployment target is 12.0, so avoid iOS 15/16-only
  // configurationWith{HierarchicalColor,PaletteColors,PreferringMulticolor}).
  UIImageSymbolConfiguration *cfg =
      [UIImageSymbolConfiguration configurationWithPointSize:_pointSize
                                                       weight:[self wg]
                                                        scale:[self sc]];
  _imageView.preferredSymbolConfiguration = cfg;
  UIColor *tint = [LynxpoSymbolsView colorFromHex:_tint];
  if (tint) {
    _imageView.image = [img imageWithTintColor:tint renderingMode:UIImageRenderingModeAlwaysOriginal];
  } else {
    _imageView.image = img;
  }
}
@end

@implementation LynxpoSymbols
- (UIView *)createView { return [[LynxpoSymbolsView alloc] init]; }

LYNX_PROP_SETTER("name", setName, NSString *) { ((LynxpoSymbolsView *)self.view).name = value; [((LynxpoSymbolsView *)self.view) reload]; }
LYNX_PROP_SETTER("weight", setWeight, NSString *) { ((LynxpoSymbolsView *)self.view).weight = value; [((LynxpoSymbolsView *)self.view) reload]; }
LYNX_PROP_SETTER("scale", setScale, NSString *) { ((LynxpoSymbolsView *)self.view).scale = value; [((LynxpoSymbolsView *)self.view) reload]; }
LYNX_PROP_SETTER("symbol-type", setSymbolType, NSString *) { ((LynxpoSymbolsView *)self.view).symbolType = value; [((LynxpoSymbolsView *)self.view) reload]; }
LYNX_PROP_SETTER("tint-color", setTintColor, NSString *) { ((LynxpoSymbolsView *)self.view).tint = value; [((LynxpoSymbolsView *)self.view) reload]; }
LYNX_PROP_SETTER("point-size", setPointSize, CGFloat) { ((LynxpoSymbolsView *)self.view).pointSize = value; [((LynxpoSymbolsView *)self.view) reload]; }

LYNX_LAZY_REGISTER_UI("lynxpo-symbols")
@end
