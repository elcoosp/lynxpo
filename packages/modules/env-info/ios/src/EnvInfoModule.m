// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "EnvInfoModule.h"
#import <UIKit/UIKit.h>

@implementation EnvInfoModule



#pragma mark - Sync API

- (BOOL)isRunningOnDevice {
  // On the iOS Simulator the model string contains "Simulator" or the
  // `TARGET_OS_SIMULATOR` macro is set at compile time; at runtime we detect
  // the simulator via the hardware model / environment.
#if TARGET_OS_SIMULATOR
  return @NO;
#else
  return @YES;
#endif
}

- (double)installTime {
  // Best-effort app install time: the modification date of the bundle's
  // executable, which is set at install time on iOS.
  NSString *execPath = [[NSBundle mainBundle] executablePath];
  NSDictionary *attrs =
      [[NSFileManager defaultManager] attributesOfItemAtPath:execPath
                                                        error:nil];
  NSDate *installDate = attrs[NSFileModificationDate];
  if (installDate) {
    return (double)([installDate timeIntervalSince1970] * 1000.0);
  }
  return 0.0;
}

- (id)envInfo {
  NSMutableDictionary *info = [NSMutableDictionary dictionary];
  info[@"isRunningOnDevice"] = @([self isRunningOnDevice]);
  info[@"installTime"] = @([self installTime]);
  info[@"osName"] = @"iOS";
  info[@"osVersion"] =
      [[UIDevice currentDevice] systemVersion] ?: [NSNull null];
  info[@"appVersion"] =
      [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleVersion"]
          ?: [NSNull null];
  info[@"appId"] =
      [[NSBundle mainBundle] bundleIdentifier] ?: [NSNull null];
  return info;
}



#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"envInfo" : NSStringFromSelector(@selector(envInfo)),
    @"installTime" : NSStringFromSelector(@selector(installTime)),
    @"isRunningOnDevice" : NSStringFromSelector(@selector(isRunningOnDevice)),
  };
}
@end
