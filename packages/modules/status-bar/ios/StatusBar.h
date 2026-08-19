// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `StatusBar`. Exposes native functionality to JS via
/// `NativeModules.StatusBar`, faithfully porting Expo's `expo-status-bar` native method surface.
@interface StatusBar : NSObject <LynxModule>

- (void)setStyleWithStyle:(NSString *)style;
- (void)setHiddenWithHidden:(BOOL)hidden;
- (void)setNetworkActivityIndicatorVisibleWithVisible:(BOOL)visible;
- (void)setBackgroundColorWithColor:(NSString *)color;

@end

NS_ASSUME_NONNULL_END
