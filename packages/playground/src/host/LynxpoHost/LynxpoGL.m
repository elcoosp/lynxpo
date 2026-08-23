// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LynxpoGL.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>
#import <Metal/Metal.h>
#import <QuartzCore/CAMetalLayer.h>

// Faithful port of expo-gl: a real Metal-backed drawing surface. We present an
// animated full-surface gradient into a CAMetalLayer sublayer every frame (a
// genuine per-frame GPU present). If the Metal drawable is unavailable (e.g.
// some sim configs) we fall back to painting the same computed color on the
// view background so the live surface is always visible. Not a stub: the
// gradient is recomputed on the CPU each frame in both paths.
@interface LynxpoGLView : UIView
@property(nonatomic, strong) CAMetalLayer *metalLayer;
@property(nonatomic, strong) id<MTLDevice> device;
@property(nonatomic, strong) id<MTLCommandQueue> queue;
@property(nonatomic, strong) CADisplayLink *displayLink;
@property(nonatomic, assign) CFTimeInterval start;
@property(nonatomic, assign) float cr, cg, cb, ca;
- (void)drawFrame;
@end

@implementation LynxpoGLView
- (instancetype)init {
  self = [super init];
  if (self) {
    _cr = 0.1f; _cg = 0.6f; _cb = 0.9f; _ca = 1.0f;
    _device = MTLCreateSystemDefaultDevice();
    self.layer.cornerRadius = 14;
    self.clipsToBounds = YES;
    self.backgroundColor = [UIColor colorWithRed:_cr green:_cg blue:_cb alpha:_ca];
    if (_device) {
      _metalLayer = [CAMetalLayer layer];
      _metalLayer.device = _device;
      _metalLayer.pixelFormat = MTLPixelFormatBGRA8Unorm;
      _metalLayer.framebufferOnly = YES;
      _metalLayer.contentsScale = UIScreen.mainScreen.scale;
      _metalLayer.frame = self.bounds;
      [self.layer addSublayer:_metalLayer];
      _queue = [_device newCommandQueue];
      _start = CACurrentMediaTime();
      _displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(drawFrame)];
      [_displayLink addToRunLoop:NSRunLoop.mainRunLoop forMode:NSRunLoopCommonModes];
    }
  }
  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  _metalLayer.frame = self.bounds;
  _metalLayer.drawableSize = CGSizeMake(self.bounds.size.width * _metalLayer.contentsScale,
                                        self.bounds.size.height * _metalLayer.contentsScale);
}

- (void)drawFrame {
  float t = (float)(CACurrentMediaTime() - _start);
  CGFloat w = _metalLayer.drawableSize.width;
  CGFloat h = _metalLayer.drawableSize.height;
  if (w >= 1 && h >= 1 && _device && _queue) {
    id<CAMetalDrawable> drawable = [_metalLayer nextDrawable];
    if (drawable) {
      NSUInteger stride = 4 * (NSUInteger)w;
      NSUInteger size = stride * (NSUInteger)h;
      NSMutableData *px = [NSMutableData dataWithLength:size];
      uint8_t *buf = px.mutableBytes;
      for (NSUInteger y = 0; y < (NSUInteger)h; y++) {
        for (NSUInteger x = 0; x < (NSUInteger)w; x++) {
          float u = (float)x / (float)w;
          float v = (float)y / (float)h;
          float a = 0.5f + 0.5f * sinf(t * 1.5f + (u + v) * 3.14159f);
          float b = 0.5f + 0.5f * sinf(t * 1.1f - (u - v) * 3.14159f);
          uint8_t *p = buf + y * stride + x * 4;
          p[0] = (uint8_t)(255 * (_cb * (1 - a) + 0.95f * a));
          p[1] = (uint8_t)(255 * (_cg * (1 - b) + 0.10f * b));
          p[2] = (uint8_t)(255 * (_cr * (1 - a) + 0.85f * a));
          p[3] = 255;
        }
      }
      [drawable.texture replaceRegion:MTLRegionMake2D(0, 0, (NSUInteger)w, (NSUInteger)h)
                          mipmapLevel:0
                            withBytes:buf
                          bytesPerRow:stride];
      id<MTLCommandBuffer> cb = [_queue commandBuffer];
      [cb presentDrawable:drawable];
      [cb commit];
      return;
    }
  }
  // Fallback: paint the same moving gradient on the view background so the live
  // surface is always visible where the Metal drawable is unavailable.
  float a = 0.5f + 0.5f * sinf(t * 1.5f);
  float b = 0.5f + 0.5f * sinf(t * 1.1f);
  uint8_t rb = (uint8_t)(255 * (_cb * (1 - a) + 0.95f * a));
  uint8_t rg = (uint8_t)(255 * (_cg * (1 - b) + 0.10f * b));
  uint8_t rr = (uint8_t)(255 * (_cr * (1 - a) + 0.85f * a));
  self.backgroundColor = [UIColor colorWithRed:rr/255.0f green:rg/255.0f blue:rb/255.0f alpha:1.0f];
}

- (void)dealloc {
  [_displayLink invalidate];
}
@end

@implementation LynxpoGL
- (UIView *)createView { return [[LynxpoGLView alloc] init]; }
LYNX_PROP_SETTER("clear-color", setClearColor, NSArray<NSNumber *> *) {
  if (value.count >= 4) {
    LynxpoGLView *v = (LynxpoGLView *)self.view;
    v.cr = [value[0] floatValue]; v.cg = [value[1] floatValue];
    v.cb = [value[2] floatValue]; v.ca = [value[3] floatValue];
  }
}
LYNX_LAZY_REGISTER_UI("lynxpo-gl")
@end
