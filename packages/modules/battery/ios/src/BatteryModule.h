// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "BatteryModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `BatteryModule`. Exposes battery info to JS via
/// `NativeModules.BatteryModule`, faithfully porting the native method surface of
/// Expo's `expo-battery` (v57) module. Method names MUST match the Android
/// `@LynxMethod` names so the shared `@lynxpo/mods-battery` accessors resolve on
/// both platforms.
@LynxNativeModule("BatteryModule")
@interface BatteryModule : NSObject <BatteryModuleSpec>

- (id)getBatteryLevel;
- (id)getBatteryState;
- (id)isLowPowerModeEnabled;

@end

NS_ASSUME_NONNULL_END
