// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `SensorsModule`. Exposes raw motion sensor
/// readings to JS via `NativeModules.SensorsModule`, faithfully porting the
/// native method surface of Expo's `expo-sensors` (latest) module. Method
/// names MUST match the Android `methodLookup` keys and the shared
/// `@lynxpo/mods-sensors` accessors.
@interface SensorsModule : NSObject <LynxModule>

- (NSDictionary *)getAccelerometer;
- (NSDictionary *)getGyroscope;
- (NSNumber *)isAvailable;
@end

NS_ASSUME_NONNULL_END
