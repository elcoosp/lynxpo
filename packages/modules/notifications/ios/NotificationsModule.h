// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `NotificationsModule`. Exposes notification availability to JS
/// via `NativeModules.NotificationsModule`, faithfully porting Expo's `expo-notifications` native
/// method surface.
@interface NotificationsModule : NSObject <LynxModule>

- (NSDictionary<NSString *, id> *)permissionsAsync;
- (void)requestPermission;
- (BOOL)isDeviceRegisteredForRemoteMessages;
- (NSInteger)badgeCountAsync;
- (NSDictionary<NSString *, NSString *> *)devicePushTokenAsync;
@end

NS_ASSUME_NONNULL_END
