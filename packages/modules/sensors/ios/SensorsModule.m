// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "SensorsModule.h"
#import <CoreMotion/CoreMotion.h>

@implementation SensorsModule

+ (NSString *)name {
  return @"SensorsModule";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"getAccelerometer" : NSStringFromSelector(@selector(getAccelerometer)),
    @"getGyroscope" : NSStringFromSelector(@selector(getGyroscope)),
    @"isAvailable" : NSStringFromSelector(@selector(isAvailable)),
  };
}

#pragma mark - Helpers

- (CMMotionManager *)freshMotionManager {
  static CMMotionManager *manager = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    manager = [[CMMotionManager alloc] init];
  });
  return manager;
}

#pragma mark - Sync API

- (NSDictionary *)readingFor:(NSString *)kind {
  CMMotionManager *manager = [self freshMotionManager];
  double x = 0, y = 0, z = 0;
  if ([kind isEqualToString:@"accelerometer"]) {
    if (manager.accelerometerAvailable) {
      CMAccelerometerData *data = manager.accelerometerData;
      // Pull a fresh sample synchronously (best-effort, one-shot).
      [manager startAccelerometerUpdates];
      data = manager.accelerometerData;
      [manager stopAccelerometerUpdates];
      if (data) {
        x = data.acceleration.x;
        y = data.acceleration.y;
        z = data.acceleration.z;
      }
    }
  } else if ([kind isEqualToString:@"gyroscope"]) {
    if (manager.gyroAvailable) {
      CMGyroData *data = manager.gyroData;
      [manager startGyroUpdates];
      data = manager.gyroData;
      [manager stopGyroUpdates];
      if (data) {
        x = data.rotationRate.x;
        y = data.rotationRate.y;
        z = data.rotationRate.z;
      }
    }
  }
  return @{
    @"x" : @(x),
    @"y" : @(y),
    @"z" : @(z),
  };
}

- (NSDictionary *)getAccelerometer {
  return [self readingFor:@"accelerometer"];
}

- (NSDictionary *)getGyroscope {
  return [self readingFor:@"gyroscope"];
}

- (NSNumber *)isAvailable {
  CMMotionManager *manager = [self freshMotionManager];
  return @(manager.accelerometerAvailable || manager.gyroAvailable);
}

#pragma mark - Async API (LynxCallbackBlock resolve:reject:)

- (void)getAccelerometerAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try {
    resolve([self getAccelerometer]);
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_SENSORS: %@", e.reason]);
  }
}

- (void)getGyroscopeAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try {
    resolve([self getGyroscope]);
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_SENSORS: %@", e.reason]);
  }
}

- (void)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try {
    resolve([self isAvailable]);
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_SENSORS: %@", e.reason]);
  }
}

@end
