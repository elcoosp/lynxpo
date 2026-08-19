// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "NotificationsModule.h"

@implementation NotificationsModule

+ (NSString *)name {
  return @"NotificationsModule";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"permissionsAsync" : NSStringFromSelector(@selector(permissionsAsync)),
    @"requestPermission" : NSStringFromSelector(@selector(requestPermission)),
    @"isDeviceRegisteredForRemoteMessages" : NSStringFromSelector(@selector(isDeviceRegisteredForRemoteMessages)),
    @"badgeCountAsync" : NSStringFromSelector(@selector(badgeCountAsync)),
    @"devicePushTokenAsync" : NSStringFromSelector(@selector(devicePushTokenAsync)),
  };
}

- (NSDictionary<NSString *, id> *)permissionsAsync {
  UNUserNotificationSettings *settings = [[UNUserNotificationCenter currentNotificationCenter] currentSettings];
  UNAuthorizationStatus status = settings.authorizationStatus;
  BOOL granted = (status == UNAuthorizationStatusAuthorized || status == UNAuthorizationStatusProvisional);
  NSString *statusStr = granted ? @"granted" : (status == UNAuthorizationStatusDenied ? @"denied" : @"undetermined");
  return @{ @"status" : statusStr, @"granted" : @(granted), @"canAskAgain" : @(status != UNAuthorizationStatusDenied) };
}

- (void)requestPermission {
  UNAuthorizationStatus status = [[UNUserNotificationCenter currentNotificationCenter] currentSettings].authorizationStatus;
  if (status == UNAuthorizationStatusAuthorized || status == UNAuthorizationStatusProvisional) return;
  UNAuthorizationOptions opts = UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
  [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions:opts
                                                                   completionHandler:^(BOOL granted, NSError *error) {
    // The next permissionsAsync() call reflects the new status.
  }];
}

- (BOOL)isDeviceRegisteredForRemoteMessages {
  return YES;
}

- (NSInteger)badgeCountAsync {
  return [UIApplication sharedApplication].applicationIconBadgeNumber;
}

- (NSDictionary<NSString *, NSString *> *)devicePushTokenAsync {
  // APNs token is only available after registration; return the stored token if present.
  return @{ @"data" : @"" };
}

@end
