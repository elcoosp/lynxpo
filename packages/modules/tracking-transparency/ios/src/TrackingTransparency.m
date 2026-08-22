// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "TrackingTransparency.h"
#import <Foundation/Foundation.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>

@implementation TrackingTransparency

- (NSString *)getAuthorizationStatus {
  if (@available(iOS 14.0, *)) {
    switch ([ATTrackingManager trackingAuthorizationStatus]) {
      case ATTrackingManagerAuthorizationStatusAuthorized:
        return @"authorized";
      case ATTrackingManagerAuthorizationStatusDenied:
        return @"denied";
      case ATTrackingManagerAuthorizationStatusRestricted:
        return @"restricted";
      default:
        return @"notDetermined";
    }
  }
  return @"unavailable";
}

- (NSString *)requestAuthorization {
  if (@available(iOS 14.0, *)) {
    __block NSString *result = @"notDetermined";
    dispatch_semaphore_t sem = dispatch_semaphore_create(0);
    [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
      switch (status) {
        case ATTrackingManagerAuthorizationStatusAuthorized:
          result = @"authorized";
          break;
        case ATTrackingManagerAuthorizationStatusDenied:
          result = @"denied";
          break;
        case ATTrackingManagerAuthorizationStatusRestricted:
          result = @"restricted";
          break;
        default:
          result = @"notDetermined";
          break;
      }
      dispatch_semaphore_signal(sem);
    }];
    dispatch_semaphore_wait(sem, DISPATCH_TIME_FOREVER);
    return result;
  }
  return @"unavailable";
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"getAuthorizationStatus" : NSStringFromSelector(@selector(getAuthorizationStatus)),
    @"requestAuthorization" : NSStringFromSelector(@selector(requestAuthorization)),
  };
}
@end
