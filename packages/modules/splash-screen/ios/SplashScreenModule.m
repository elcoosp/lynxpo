// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "SplashScreenModule.h"

@implementation SplashScreenModule

+ (NSString *)name {
  return @"SplashScreenModule";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"hideAsync" : NSStringFromSelector(@selector(hideAsync:reject:)),
    @"preventAutoHideAsync" : NSStringFromSelector(@selector(preventAutoHideAsync:reject:)),
    @"statusAsync" : NSStringFromSelector(@selector(statusAsync:reject:)),
  };
}

#pragma mark - Async API

// The Lynx Explorer has no native splash screen to control; the splash is
// already hidden once the Lynx view mounts. These methods resolve
// immediately with the real current state so the Expo-compatible API surface
// is present and non-blocking.
- (void)hideAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@"hidden");
}

- (void)preventAutoHideAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(nil);
}

- (void)statusAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  // Splash is hidden once the Lynx surface is mounted.
  resolve(@"hidden");
}

@end
