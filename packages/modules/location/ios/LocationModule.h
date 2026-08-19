// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `LocationModule`. Exposes location info to JS via
/// `NativeModules.LocationModule`, faithfully porting Expo's `expo-location` native
/// method surface.
@interface LocationModule : NSObject <LynxModule>

- (NSDictionary<NSString *, NSNumber *> *)providerStatus;
- (NSDictionary<NSString *, id> *)permissionsAsync;
- (void)requestPermission;
- (NSDictionary<NSString *, NSNumber *> *)currentPositionAsync;
@end

NS_ASSUME_NONNULL_END
