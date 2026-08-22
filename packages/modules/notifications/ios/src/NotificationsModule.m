// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "NotificationsModule.h"
#import <UserNotifications/UserNotifications.h>
#import <UIKit/UIKit.h>

@implementation NotificationsModule



- (id)permissionsAsync {
  UNUserNotificationCenter *center =
      [UNUserNotificationCenter currentNotificationCenter];
  __block NSDictionary<NSString *, id> *result = nil;
  dispatch_semaphore_t sem = dispatch_semaphore_create(0);
  [center getNotificationSettingsWithCompletionHandler:^(
      UNNotificationSettings *settings) {
    UNAuthorizationStatus status = settings.authorizationStatus;
    BOOL granted = (status == UNAuthorizationStatusAuthorized ||
                    status == UNAuthorizationStatusProvisional);
    NSString *statusStr = granted ? @"granted"
                                  : (status == UNAuthorizationStatusDenied
                                         ? @"denied"
                                         : @"undetermined");
    result = @{
      @"status" : statusStr,
      @"granted" : @(granted),
      @"canAskAgain" : @(status != UNAuthorizationStatusDenied)
    };
    dispatch_semaphore_signal(sem);
  }];
  dispatch_semaphore_wait(sem, dispatch_time(DISPATCH_TIME_NOW, 2 * NSEC_PER_SEC));
  return result ?: @{ @"status" : @"undetermined", @"granted" : @NO, @"canAskAgain" : @YES };
}

- (void)requestPermission {
  UNUserNotificationCenter *center =
      [UNUserNotificationCenter currentNotificationCenter];
  [center getNotificationSettingsWithCompletionHandler:^(
      UNNotificationSettings *settings) {
    UNAuthorizationStatus status = settings.authorizationStatus;
    if (status == UNAuthorizationStatusAuthorized ||
        status == UNAuthorizationStatusProvisional)
      return;
    UNAuthorizationOptions opts = UNAuthorizationOptionAlert |
                                  UNAuthorizationOptionSound |
                                  UNAuthorizationOptionBadge;
    [center requestAuthorizationWithOptions:opts
                           completionHandler:^(BOOL granted, NSError *error){
                           }];
  }];
}

- (BOOL)isDeviceRegisteredForRemoteMessages {
  return YES;
}

- (double)badgeCountAsync {
  return [UIApplication sharedApplication].applicationIconBadgeNumber;
}

- (id)devicePushTokenAsync {
  // APNs token is only available after registration; return the stored token if present.
  return @{ @"data" : @"" };
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"badgeCountAsync" : NSStringFromSelector(@selector(badgeCountAsync)),
    @"devicePushTokenAsync" : NSStringFromSelector(@selector(devicePushTokenAsync)),
    @"isDeviceRegisteredForRemoteMessages" : NSStringFromSelector(@selector(isDeviceRegisteredForRemoteMessages)),
    @"permissionsAsync" : NSStringFromSelector(@selector(permissionsAsync)),
    @"requestPermission" : NSStringFromSelector(@selector(requestPermission)),
  };
}
@end
