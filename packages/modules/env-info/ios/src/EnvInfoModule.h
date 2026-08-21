// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "EnvInfoModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `lynxpo.core.modules.envinfo.EnvInfoModule`.
/// Exposes environment info to JS via `NativeModules.EnvInfoModule` so the
/// `@lynxpo/mods-env-info` hooks return real data on iOS (the Android-only
/// module is undefined there).
@LynxNativeModule("EnvInfoModule")
@interface EnvInfoModule : NSObject <EnvInfoModuleSpec>

- (BOOL)isRunningOnDevice;
- (double)installTime;
- (id)envInfo;

@end

NS_ASSUME_NONNULL_END
