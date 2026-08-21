// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "SystemUiSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `SystemUi`. Exposes native functionality to JS via
/// `NativeModules.SystemUi`, faithfully porting Expo's `expo-system-ui` native method surface.
@LynxNativeModule("SystemUi")
@interface SystemUi : NSObject <SystemUiSpec>

- (NSString *)getBackgroundColor;
- (void)setBackgroundColor:(NSString *)color;
- (void)setStatusBarBackgroundColor:(NSString *)color;

@end

NS_ASSUME_NONNULL_END
