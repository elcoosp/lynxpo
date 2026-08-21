// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "StatusBarSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `StatusBar`. Exposes native functionality to JS via
/// `NativeModules.StatusBar`, faithfully porting Expo's `expo-status-bar` native method surface.
@LynxNativeModule("StatusBar")
@interface StatusBar : NSObject <StatusBarSpec>

- (void)setStyle:(NSString *)style;
- (void)setHidden:(BOOL)hidden;
- (void)setNetworkActivityIndicatorVisible:(BOOL)visible;
- (void)setBackgroundColor:(NSString *)color;

@end

NS_ASSUME_NONNULL_END
