// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "BatteryModule.h"
#import <UIKit/UIKit.h>

@implementation BatteryModule



+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"getBatteryLevel" : NSStringFromSelector(@selector(getBatteryLevel)),
    @"getBatteryState" : NSStringFromSelector(@selector(getBatteryState)),
    @"isLowPowerModeEnabled" : NSStringFromSelector(@selector(isLowPowerModeEnabled)),
  };
}

#pragma mark - LynxModule methods

- (NSNumber *)getBatteryLevel {
  UIDevice *device = [UIDevice currentDevice];
  device.batteryMonitoringEnabled = YES;
  // UIDevice batteryLevel is 0..1, or -1 when unknown. Mirrors Expo's
  // getBatteryLevelAsync native return.
  return @(device.batteryLevel);
}

- (NSNumber *)getBatteryState {
  UIDevice *device = [UIDevice currentDevice];
  device.batteryMonitoringEnabled = YES;
  // Apple's UIDeviceBatteryState raw values map 1:1 onto Expo's BatteryState
  // enum (UNKNOWN=0, UNPLUGGED=1, CHARGING=2, FULL=3, NOT_CHARGING=4).
  return @((NSInteger)device.batteryState);
}

- (NSNumber *)isLowPowerModeEnabled {
  return @([NSProcessInfo processInfo].isLowPowerModeEnabled);
}

@end
