// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "SplashScreenModule.h"

@implementation SplashScreenModule



#pragma mark - Async API

// The Lynx Explorer has no native splash screen to control; the splash is
// already hidden once the Lynx view mounts. These methods resolve
// immediately with the real current state so the Expo-compatible API surface
// is present and non-blocking.
- (NSString *)hideAsync {

  return @"hidden";
}

- (NSString *)preventAutoHideAsync {

  return nil;
}

- (NSString *)statusAsync {

  // Splash is hidden once the Lynx surface is mounted.
  return @"hidden";
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"hideAsync" : NSStringFromSelector(@selector(hideAsync)),
    @"preventAutoHideAsync" : NSStringFromSelector(@selector(preventAutoHideAsync)),
    @"statusAsync" : NSStringFromSelector(@selector(statusAsync)),
  };
}
@end
