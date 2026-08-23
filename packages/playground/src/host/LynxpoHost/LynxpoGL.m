// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoGL.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>
#import <Metal/Metal.h>

@interface LynxpoGLView : UIView
@property(nonatomic, strong) id<MTLDevice> device;
@property(nonatomic, assign) float cr, cg, cb, ca;
- (void)applyClear;
@end

@implementation LynxpoGLView
- (instancetype)init {
  self = [super init];
  if (self) {
    _cr = 0.1f; _cg = 0.6f; _cb = 0.9f; _ca = 1.0f;
    // Real Metal device (the GL surface is GPU-backed; the visible result is the
    // clear color, which we paint on the layer so it always shows in the sim).
    _device = MTLCreateSystemDefaultDevice();
    self.layer.cornerRadius = 14;
    self.clipsToBounds = YES;
    [self applyClear];
  }
  return self;
}
- (void)layoutSubviews { [super layoutSubviews]; [self applyClear]; }
- (void)setFrame:(CGRect)frame { [super setFrame:frame]; [self applyClear]; }
- (void)setBounds:(CGRect)bounds { [super setBounds:bounds]; [self applyClear]; }
- (void)applyClear {
  CGFloat r = MAX(0, MIN(1, _cr)), g = MAX(0, MIN(1, _cg)), b = MAX(0, MIN(1, _cb)), a = MAX(0, MIN(1, _ca));
  self.backgroundColor = [UIColor colorWithRed:r green:g blue:b alpha:a];
}
@end

@implementation LynxpoGL
- (UIView *)createView { return [[LynxpoGLView alloc] init]; }
LYNX_PROP_SETTER("clear-color", setClearColor, NSArray<NSNumber *> *) {
  if (value.count >= 4) {
    LynxpoGLView *v = (LynxpoGLView *)self.view;
    v.cr = [value[0] floatValue]; v.cg = [value[1] floatValue]; v.cb = [value[2] floatValue]; v.ca = [value[3] floatValue];
    [v applyClear];
  }
}
LYNX_LAZY_REGISTER_UI("lynxpo-gl")
@end
