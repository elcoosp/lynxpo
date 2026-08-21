// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "ScreenOrientationModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `ScreenOrientationModule`. Exposes device info to JS via
/// `NativeModules.ScreenOrientationModule`, faithfully porting Expo's native method surface.
@LynxNativeModule("ScreenOrientationModule")
@interface ScreenOrientationModule : NSObject <ScreenOrientationModuleSpec>

- (double)getOrientation;
- (double)getOrientationLock;
- (void)lock:(int)orientation;
- (void)lockPlatform:(int)orientationLock;
- (BOOL)supportsOrientationLock;
@end

NS_ASSUME_NONNULL_END
