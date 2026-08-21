// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "BrightnessModule.h"
#import <UIKit/UIKit.h>

@implementation BrightnessModule



+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"getBrightness" : NSStringFromSelector(@selector(getBrightness)),
    @"setBrightness" : NSStringFromSelector(@selector(setBrightness:)),
    @"getSystemBrightness" : NSStringFromSelector(@selector(getSystemBrightness)),
    @"isUsingSystemBrightness" : NSStringFromSelector(@selector(isUsingSystemBrightness)),
    @"getSystemBrightnessMode" : NSStringFromSelector(@selector(getSystemBrightnessMode)),
  };
}

- (double)getBrightness {
  return UIScreen.mainScreen.brightness;
}

- (void)setBrightness:(double)brightnessValue {
  UIScreen.mainScreen.brightness = brightnessValue;
}

- (double)getSystemBrightness {
  return UIScreen.mainScreen.brightness;
}

- (BOOL)isUsingSystemBrightness {
  return YES;
}

- (int)getSystemBrightnessMode {
  return 2; // MANUAL on iOS (system auto-brightness not directly readable)
}

- (id)getBrightnessAsync {

  @try { return @([self getBrightness]); } @catch (NSException *e) { return nil; }
}
- (void)setBrightnessAsync:(double)value {
  @try { [self setBrightness:value]; return nil; } @catch (NSException *e) { return nil; }
}
- (id)getSystemBrightnessAsync {

  @try { return @([self getSystemBrightness]); } @catch (NSException *e) { return nil; }
}
- (id)isUsingSystemBrightnessAsync {

  @try { return @([self isUsingSystemBrightness]); } @catch (NSException *e) { return nil; }
}
- (id)getSystemBrightnessModeAsync {

  @try { return @([self getSystemBrightnessMode]); } @catch (NSException *e) { return nil; }
}
- (void)addListener:(NSString *)eventName {
  // The LynxPo playground showcase reads values via the *Async promise APIs,
  // not via native events, so listener registration is a safe no-op here.
}
- (void)removeListeners:(NSInteger)count {}

@end
