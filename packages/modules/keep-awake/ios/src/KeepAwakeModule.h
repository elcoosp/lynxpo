// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "KeepAwakeModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `KeepAwakeModule`. Exposes device info to JS via
/// `NativeModules.KeepAwakeModule`, faithfully porting Expo's native method surface.
@LynxNativeModule("KeepAwakeModule")
@interface KeepAwakeModule : NSObject <KeepAwakeModuleSpec>

- (void)activate;
- (void)deactivate;
- (BOOL)isActivated;
@end

NS_ASSUME_NONNULL_END
