// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import <Security/Security.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `SecureStoreModule`. Exposes an encrypted
/// key/value store to JS via `NativeModules.SecureStoreModule`, faithfully
/// porting the native method surface of Expo's `expo-secure-store` (latest)
/// module. Method names MUST match the Android `methodLookup` keys and the
/// shared `@lynxpo/mods-secure-store` accessors. Backed by the iOS Keychain.
@interface SecureStoreModule : NSObject <LynxModule>

- (NSNumber *)isAvailable;
@end

NS_ASSUME_NONNULL_END
