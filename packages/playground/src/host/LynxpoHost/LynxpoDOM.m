// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoDOM.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>
#import <WebKit/WebKit.h>

@implementation LynxpoDOMView
- (instancetype)init {
  self = [super init];
  if (self) {
    WKWebViewConfiguration *cfg = [[WKWebViewConfiguration alloc] init];
    _web = [[WKWebView alloc] initWithFrame:self.bounds configuration:cfg];
    _web.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    _web.backgroundColor = [UIColor colorWithWhite:0.08 alpha:1.0];
    _web.layer.cornerRadius = 14;
    _web.clipsToBounds = YES;
    [self addSubview:_web];
    [_web loadHTMLString:@"<html><body style='margin:0;font-family:system-ui;color:#0ff;background:#0a0a12;padding:12px'><b>expo-dom</b><p>DOM surface ready.</p></body></html>" baseURL:nil];
  }
  return self;
}
- (void)layoutSubviews { [super layoutSubviews]; _web.frame = self.bounds; }
- (void)setFrame:(CGRect)frame { [super setFrame:frame]; _web.frame = self.bounds; }
- (void)setBounds:(CGRect)bounds { [super setBounds:bounds]; _web.frame = self.bounds; }
@end

@implementation LynxpoDOM
- (UIView *)createView { return [[LynxpoDOMView alloc] init]; }
LYNX_PROP_SETTER("markup", setMarkup, NSString *) {
  if (value.length) [((LynxpoDOMView *)self.view).web loadHTMLString:value baseURL:nil];
}
LYNX_PROP_SETTER("source", setSource, NSString *) {
  if (value.length) [((LynxpoDOMView *)self.view).web loadHTMLString:value baseURL:nil];
}
LYNX_LAZY_REGISTER_UI("lynxpo-dom")
@end
