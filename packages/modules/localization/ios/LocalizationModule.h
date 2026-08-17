// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `LocalizationModule`. Exposes device
/// localization info to JS via `NativeModules.LocalizationModule`, faithfully
/// porting the native method surface of Expo's `expo-localization` (latest)
/// module. Method names MUST match the Android `@LynxMethod` names so the
/// shared `@lynxpo/mods-localization` accessors resolve on both platforms.
@interface LocalizationModule : NSObject <LynxModule>

- (NSArray<NSDictionary *> *)getLocales;
- (NSArray<NSDictionary *> *)getCalendars;

@end

NS_ASSUME_NONNULL_END
