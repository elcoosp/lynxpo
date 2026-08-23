// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoCheckbox.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>

@interface LynxpoCheckboxView : UIView
@property(nonatomic, assign) BOOL checked;
@property(nonatomic, copy) NSString *color;     // hex tint
@property(nonatomic, copy) NSString *style;     // checkbox | switch
- (void)redraw;
@end

@implementation LynxpoCheckboxView
- (instancetype)init {
  self = [super init];
  if (self) {
    _checked = NO;
    _color = @"#007aff";
    _style = @"checkbox";
    self.backgroundColor = [UIColor clearColor];
    [self redraw];
  }
  return self;
}
- (void)setFrame:(CGRect)frame { [super setFrame:frame]; [self setNeedsDisplay]; }
- (void)setBounds:(CGRect)bounds { [super setBounds:bounds]; [self setNeedsDisplay]; }
- (void)layoutSubviews { [super layoutSubviews]; [self setNeedsDisplay]; }
- (void)redraw { [self setNeedsDisplay]; }

+ (UIColor *)colorFromHex:(NSString *)hex {
  NSString *s = [hex stringByReplacingOccurrencesOfString:@"#" withString:@""];
  if (s.length == 3) s = [NSString stringWithFormat:@"%@%@%@%@%@%@",[s substringWithRange:NSMakeRange(0,1)],[s substringWithRange:NSMakeRange(0,1)],[s substringWithRange:NSMakeRange(1,1)],[s substringWithRange:NSMakeRange(1,1)],[s substringWithRange:NSMakeRange(2,1)],[s substringWithRange:NSMakeRange(2,1)]];
  if (s.length == 6) s = [s stringByAppendingString:@"ff"];
  if (s.length != 8) return [UIColor systemBlueColor];
  unsigned int rgba = 0; [[NSScanner scannerWithString:s] scanHexInt:&rgba];
  return [UIColor colorWithRed:((rgba & 0x00ff0000) >> 16)/255.0 green:((rgba & 0x0000ff00) >> 8)/255.0 blue:(rgba & 0x000000ff)/255.0 alpha:((rgba & 0xff000000) >> 24)/255.0];
}

- (void)drawRect:(CGRect)rect {
  [super drawRect:rect];
  CGContextRef ctx = UIGraphicsGetCurrentContext();
  if (!ctx) return;
  UIColor *tint = [LynxpoCheckboxView colorFromHex:_color] ?: [UIColor systemBlueColor];
  CGFloat dim = MIN(rect.size.width, rect.size.height);
  CGRect box = CGRectMake((rect.size.width - dim) / 2.0, (rect.size.height - dim) / 2.0, dim, dim);
  CGFloat r = dim * 0.18;
  UIBezierPath *path = [UIBezierPath bezierPathWithRoundedRect:box cornerRadius:r];
  if (_checked) {
    [tint setFill]; [path fill];
    // white checkmark
    CGContextSetStrokeColorWithColor(ctx, [UIColor whiteColor].CGColor);
    CGContextSetLineWidth(ctx, dim * 0.12);
    CGContextSetLineCap(ctx, kCGLineCapRound);
    CGContextSetLineJoin(ctx, kCGLineJoinRound);
    CGFloat cx = box.origin.x, cy = box.origin.y, d = dim;
    CGContextBeginPath(ctx);
    CGContextMoveToPoint(ctx, cx + d * 0.28, cy + d * 0.52);
    CGContextAddLineToPoint(ctx, cx + d * 0.44, cy + d * 0.68);
    CGContextAddLineToPoint(ctx, cx + d * 0.74, cy + d * 0.34);
    CGContextStrokePath(ctx);
  } else {
    [tint setStroke]; path.lineWidth = dim * 0.10; [path stroke];
  }
}
@end

@implementation LynxpoCheckbox
- (UIView *)createView { return [[LynxpoCheckboxView alloc] init]; }

LYNX_PROP_SETTER("checked", setChecked, BOOL) { ((LynxpoCheckboxView *)self.view).checked = value; [((LynxpoCheckboxView *)self.view) redraw]; }
LYNX_PROP_SETTER("color", setColor, NSString *) { ((LynxpoCheckboxView *)self.view).color = value; [((LynxpoCheckboxView *)self.view) redraw]; }
LYNX_PROP_SETTER("style", setStyle, NSString *) { ((LynxpoCheckboxView *)self.view).style = value; [((LynxpoCheckboxView *)self.view) redraw]; }
LYNX_PROP_SETTER("disabled", setDisabled, BOOL) { /* visual only: keep interactive */ }

LYNX_LAZY_REGISTER_UI("lynxpo-checkbox")
@end
