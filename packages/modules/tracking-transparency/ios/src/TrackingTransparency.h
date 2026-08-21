// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "TrackingTransparencySpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `TrackingTransparency`. Exposes native functionality to JS via
/// `NativeModules.TrackingTransparency`, faithfully porting Expo's `expo-tracking-transparency` native method surface.
@LynxNativeModule("TrackingTransparency")
@interface TrackingTransparency : NSObject <TrackingTransparencySpec>

- (NSString *)getAuthorizationStatus;
- (NSString *)requestAuthorization;

@end

NS_ASSUME_NONNULL_END
