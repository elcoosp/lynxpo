// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "ConstantsModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `ConstantsModule`. Exposes app/device
/// constants to JS via `NativeModules.ConstantsModule`, faithfully porting
/// Expo's `expo-constants` native method surface.
@LynxNativeModule("ConstantsModule")
@interface ConstantsModule : NSObject <ConstantsModuleSpec>

- (NSString *)appOwnership;
- (NSString *)platform;
- (NSString *)executionEnvironment;
- (NSString *)sessionId;
- (NSString *)installationId;
- (BOOL)isHeadless;
- (id)systemFonts;
- (id)version;
@end

NS_ASSUME_NONNULL_END
