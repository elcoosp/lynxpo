// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "CryptoModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `CryptoModule`. Exposes cryptographic
/// primitives to JS via `NativeModules.CryptoModule`, faithfully porting the
/// native method surface of Expo's `expo-crypto` (latest) module. Method names
/// MUST match the Android `methodLookup` keys and the shared
/// `@lynxpo/mods-crypto` accessors.
@LynxNativeModule("CryptoModule")
@interface CryptoModule : NSObject <CryptoModuleSpec>

- (NSString *)digestString:(NSString *)algorithm data:(NSString *)data encoding:(NSString *)encoding;
- (NSString *)getRandomBytes:(NSNumber *)byteCount;
- (NSString *)randomUUID;
@end

NS_ASSUME_NONNULL_END
