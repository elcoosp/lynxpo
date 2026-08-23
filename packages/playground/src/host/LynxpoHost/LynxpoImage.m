// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoImage.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>

@interface LynxpoImageView : UIView
@property(nonatomic, copy) NSString *source;   // base64, data: URI, or http(s) URL
@property(nonatomic, copy) NSString *tint;
@property(nonatomic, copy) NSString *contentFit; // cover | contain | fill
- (void)reload;
@end

@implementation LynxpoImageView
- (instancetype)init {
  self = [super init];
  if (self) {
    self.backgroundColor = [UIColor colorWithWhite:0.10 alpha:1.0];
    _contentFit = @"cover";
    _source = @"";
    self.layer.contentsGravity = kCAGravityResizeAspect;
  }
  return self;
}
- (void)applyFit {
  if ([_contentFit isEqualToString:@"contain"]) self.layer.contentsGravity = kCAGravityResizeAspect;
  else if ([_contentFit isEqualToString:@"fill"]) self.layer.contentsGravity = kCAGravityResize;
  else self.layer.contentsGravity = kCAGravityResizeAspectFill;
}
- (void)reload {
  [self applyFit];
  if (_source.length == 0) { self.layer.contents = nil; return; }
  UIImage *img = nil;
  // 1) data: URI or raw base64 — only accept if it decodes to a real image
  NSString *b64 = _source;
  if ([b64 hasPrefix:@"data:"]) {
    NSRange comma = [b64 rangeOfString:@","];
    if (comma.location != NSNotFound) b64 = [b64 substringFromIndex:comma.location + 1];
  }
  if (b64.length > 0 && !([b64 hasPrefix:@"http://"] || [b64 hasPrefix:@"https://"])) {
    NSData *d = [[NSData alloc] initWithBase64EncodedString:b64 options:0];
    if (d && [UIImage imageWithData:d].size.width > 0) img = [UIImage imageWithData:d];
  }
  // 2) remote URL
  if (!img && ([_source hasPrefix:@"http://"] || [_source hasPrefix:@"https://"])) {
    NSURL *u = [NSURL URLWithString:_source];
    if (u) { @try { NSData *d = [NSData dataWithContentsOfURL:u options:NSDataReadingUncached error:nil]; if (d) img = [UIImage imageWithData:d]; } @catch (NSException *e) {} }
  }
  // 2b) local file:// or absolute path (e.g. a bundled sample in the host)
  if (!img && ([_source hasPrefix:@"file://"] || [_source hasPrefix:@"/"])) {
    NSString *path = _source;
    if ([path hasPrefix:@"file://"]) path = [path substringFromIndex:7];
    NSData *d = [NSData dataWithContentsOfFile:path options:NSDataReadingUncached error:nil];
    if (d) img = [UIImage imageWithData:d];
  }
  // 3) system symbol fallback so the component always shows something real
  if (!img) {
    img = [UIImage systemImageNamed:_source];
    if (img && _tint.length) {
      UIColor *tc = [LynxpoImageView colorFromHex:_tint];
      if (tc) {
        // SF Symbols are template images: render the tinted variant to a
        // CGImage so it survives assignment to layer.contents (which strips
        // UIImage tint). Without this the symbol shows black.
        UIGraphicsImageRenderer *r = [[UIGraphicsImageRenderer alloc] initWithSize:img.size];
        img = [r imageWithActions:^(UIGraphicsImageRendererContext *ctx) {
          [tc setFill];
          [img drawInRect:CGRectMake(0, 0, img.size.width, img.size.height)];
        }];
      }
    }
  }
  if (img) self.layer.contents = (id)(img.CGImage);
  else self.layer.contents = nil;
}
+ (UIColor *)colorFromHex:(NSString *)hex {
  NSString *s = [hex stringByReplacingOccurrencesOfString:@"#" withString:@""];
  if (s.length == 3) s = [NSString stringWithFormat:@"%@%@%@%@%@%@",[s substringWithRange:NSMakeRange(0,1)],[s substringWithRange:NSMakeRange(0,1)],[s substringWithRange:NSMakeRange(1,1)],[s substringWithRange:NSMakeRange(1,1)],[s substringWithRange:NSMakeRange(2,1)],[s substringWithRange:NSMakeRange(2,1)]];
  if (s.length == 6) s = [s stringByAppendingString:@"ff"];
  if (s.length != 8) return nil;
  unsigned int rgba = 0; [[NSScanner scannerWithString:s] scanHexInt:&rgba];
  return [UIColor colorWithRed:((rgba & 0x00ff0000) >> 16)/255.0 green:((rgba & 0x0000ff00) >> 8)/255.0 blue:(rgba & 0x000000ff)/255.0 alpha:((rgba & 0xff000000) >> 24)/255.0];
}
@end

@implementation LynxpoImage
- (UIView *)createView { return [[LynxpoImageView alloc] init]; }
LYNX_PROP_SETTER("source", setSource, NSString *) { ((LynxpoImageView *)self.view).source = value ?: @""; [((LynxpoImageView *)self.view) reload]; }
LYNX_PROP_SETTER("tint-color", setTint, NSString *) { ((LynxpoImageView *)self.view).tint = value; [((LynxpoImageView *)self.view) reload]; }
LYNX_PROP_SETTER("content-fit", setContentFit, NSString *) { ((LynxpoImageView *)self.view).contentFit = value ?: @"cover"; [((LynxpoImageView *)self.view) reload]; }
LYNX_LAZY_REGISTER_UI("lynxpo-image")
@end
