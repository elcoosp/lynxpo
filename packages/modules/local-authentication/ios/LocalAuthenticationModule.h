// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `LocalAuthenticationModule`. Exposes device
/// biometric/auth state to JS via `NativeModules.LocalAuthenticationModule`,
/// faithfully porting the native method surface of Expo's
/// `expo-local-authentication` (latest) module. Method names MUST match the
/// Android `methodLookup` keys and the shared `@lynxpo/mods-local-authentication`
/// accessors.
@interface LocalAuthenticationModule : NSObject <LynxModule>

- (NSNumber *)hasHardware;
- (NSNumber *)isEnrolled;
- (NSString *)getEnrolledLevel;
- (NSString *)supportedAuthenticationTypes;
@end

NS_ASSUME_NONNULL_END
