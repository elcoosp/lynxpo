// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoWidgetCard.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>
#import <Lynx/LynxEvent.h>
#import <Lynx/LynxEventDetail.h>
#import <Lynx/LynxUIContext.h>
#import <Lynx/LynxContext.h>

@interface LynxpoWidgetCardView : UIView
@property(nonatomic, strong) UIImageView *iconView;
@property(nonatomic, strong) UILabel *titleLabel;
@property(nonatomic, strong) UILabel *subLabel;
@property(nonatomic, weak) id target;
@end

@implementation LynxpoWidgetCardView
- (instancetype)init {
  self = [super init];
  if (self) {
    self.backgroundColor = [UIColor colorWithRed:0.10 green:0.16 blue:0.22 alpha:1.0];
    self.layer.cornerRadius = 16;
    self.layer.borderWidth = 1.5;
    self.layer.borderColor = [UIColor colorWithRed:0.07 green:0.9 blue:0.9 alpha:0.9].CGColor;
    self.clipsToBounds = YES;
    self.userInteractionEnabled = YES;

    _iconView = [[UIImageView alloc] initWithFrame:CGRectMake(10, 10, 24, 24)];
    _iconView.contentMode = UIViewContentModeScaleAspectFit;
    _iconView.tintColor = [UIColor colorWithRed:0.07 green:0.9 blue:0.9 alpha:1.0];
    if (@available(iOS 13.0, *)) {
      _iconView.image = [UIImage systemImageNamed:@"star.circle.fill"];
    }
    [self addSubview:_iconView];

    _titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, 38, 100, 18)];
    _titleLabel.font = [UIFont boldSystemFontOfSize:13];
    _titleLabel.textColor = [UIColor whiteColor];
    _titleLabel.text = @"Lynxpo";
    [self addSubview:_titleLabel];

    _subLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, 56, 100, 14)];
    _subLabel.font = [UIFont systemFontOfSize:11];
    _subLabel.textColor = [UIColor colorWithWhite:0.8 alpha:1.0];
    _subLabel.text = @"widget card";
    [self addSubview:_subLabel];
  }
  return self;
}
- (void)layoutSubviews {
  [super layoutSubviews];
  _iconView.frame = CGRectMake(10, 10, 24, 24);
  _titleLabel.frame = CGRectMake(10, 38, self.bounds.size.width - 20, 18);
  _subLabel.frame = CGRectMake(10, 56, self.bounds.size.width - 20, 14);
}
- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  [super touchesEnded:touches withEvent:event];
  [UIView animateWithDuration:0.12 animations:^{
    self.layer.borderColor = [UIColor colorWithRed:0.6 green:1.0 blue:1.0 alpha:1.0].CGColor;
    self.transform = CGAffineTransformMakeScale(0.96, 0.96);
  } completion:^(BOOL done) {
    self.layer.borderColor = [UIColor colorWithRed:0.07 green:0.9 blue:0.9 alpha:0.9].CGColor;
    self.transform = CGAffineTransformIdentity;
  }];
}
@end

@interface LynxpoWidgetCard ()
@end

@implementation LynxpoWidgetCard
- (UIView *)createView { LynxpoWidgetCardView *v = [[LynxpoWidgetCardView alloc] init]; v.target = self; return v; }

- (void)postTap {
  LynxCustomEvent *ev = [[LynxCustomEvent alloc] initWithName:@"tap" targetSign:self.sign];
  LynxEventDetail *detail = [[LynxEventDetail alloc] initWithEvent:ev target:self lynxView:[[self.context lynxContext] getLynxView]];
  [self dispatchEvent:detail];
}

LYNX_PROP_SETTER("corner-radius", setCornerRadius, CGFloat) {
  ((LynxpoWidgetCardView *)self.view).layer.cornerRadius = value;
  ((LynxpoWidgetCardView *)self.view).clipsToBounds = YES;
}
LYNX_PROP_SETTER("background-color", setBackgroundColor, NSString *) {
  NSString *s = [value stringByReplacingOccurrencesOfString:@"#" withString:@""];
  if (s.length == 6) s = [s stringByAppendingString:@"ff"];
  if (s.length == 8) {
    unsigned int rgba = 0;
    if ([[NSScanner scannerWithString:s] scanHexInt:&rgba])
      ((LynxpoWidgetCardView *)self.view).backgroundColor =
          [UIColor colorWithRed:((rgba & 0x00ff0000) >> 16) / 255.0
                           green:((rgba & 0x0000ff00) >> 8) / 255.0
                            blue:(rgba & 0x000000ff) / 255.0
                           alpha:((rgba & 0xff000000) >> 24) / 255.0];
  }
}
LYNX_LAZY_REGISTER_UI("lynxpo-widget-card")
@end
