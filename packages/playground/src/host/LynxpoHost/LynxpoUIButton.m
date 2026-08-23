// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoUIButton.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>

@interface LynxpoUIButtonView : UIView
@property(nonatomic, strong) UILabel *label;
@property(nonatomic, assign) BOOL pressed;
@end

@implementation LynxpoUIButtonView
- (instancetype)init {
  self = [super init];
  if (self) {
    _pressed = NO;
    self.backgroundColor = [UIColor colorWithRed:0.07 green:0.9 blue:0.9 alpha:0.12];
    self.layer.cornerRadius = 12;
    self.layer.borderWidth = 1.5;
    self.layer.borderColor = [UIColor colorWithRed:0.07 green:0.9 blue:0.9 alpha:1.0].CGColor;
    self.clipsToBounds = YES;
    self.userInteractionEnabled = YES;
    _label = [[UILabel alloc] initWithFrame:self.bounds];
    _label.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    _label.font = [UIFont boldSystemFontOfSize:15];
    _label.textColor = [UIColor colorWithRed:0.07 green:0.9 blue:0.9 alpha:1.0];
    _label.textAlignment = NSTextAlignmentCenter;
    _label.text = @"Press me";
    [self addSubview:_label];
  }
  return self;
}
- (void)layoutSubviews { [super layoutSubviews]; _label.frame = self.bounds; }
- (void)setFrame:(CGRect)frame { [super setFrame:frame]; _label.frame = self.bounds; }
- (void)setBounds:(CGRect)bounds { [super setBounds:bounds]; _label.frame = self.bounds; }
- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  [super touchesEnded:touches withEvent:event];
  _pressed = !_pressed;
  if (_pressed) {
    self.backgroundColor = [UIColor colorWithRed:0.07 green:0.9 blue:0.9 alpha:0.45];
    _label.text = @"Pressed ✓";
  } else {
    self.backgroundColor = [UIColor colorWithRed:0.07 green:0.9 blue:0.9 alpha:0.12];
    _label.text = @"Press me";
  }
}
@end

@implementation LynxpoUIButton
- (UIView *)createView { return [[LynxpoUIButtonView alloc] init]; }

LYNX_PROP_SETTER("title", setTitle, NSString *) { ((LynxpoUIButtonView *)self.view).label.text = value ?: @"Press me"; }
LYNX_PROP_SETTER("color", setColor, NSString *) {
  UIColor *c = [LynxpoUIButton colorFromHex:value];
  if (c) {
    ((LynxpoUIButtonView *)self.view).label.textColor = c;
    ((LynxpoUIButtonView *)self.view).layer.borderColor = c.CGColor;
  }
}
LYNX_PROP_SETTER("disabled", setDisabled, BOOL) { ((LynxpoUIButtonView *)self.view).userInteractionEnabled = !value; }
+ (UIColor *)colorFromHex:(NSString *)hex {
  NSString *s = [hex stringByReplacingOccurrencesOfString:@"#" withString:@""];
  if (s.length == 3) s = [NSString stringWithFormat:@"%@%@%@%@%@%@",[s substringWithRange:NSMakeRange(0,1)],[s substringWithRange:NSMakeRange(0,1)],[s substringWithRange:NSMakeRange(1,1)],[s substringWithRange:NSMakeRange(1,1)],[s substringWithRange:NSMakeRange(2,1)],[s substringWithRange:NSMakeRange(2,1)]];
  if (s.length == 6) s = [s stringByAppendingString:@"ff"];
  if (s.length != 8) return nil;
  unsigned int rgba = 0; [[NSScanner scannerWithString:s] scanHexInt:&rgba];
  return [UIColor colorWithRed:((rgba & 0x00ff0000) >> 16)/255.0 green:((rgba & 0x0000ff00) >> 8)/255.0 blue:(rgba & 0x000000ff)/255.0 alpha:((rgba & 0xff000000) >> 24)/255.0];
}
LYNX_LAZY_REGISTER_UI("lynxpo-ui-button")
@end
