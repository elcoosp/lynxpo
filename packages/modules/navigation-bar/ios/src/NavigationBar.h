// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "NavigationBarSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `NavigationBar`. Exposes native functionality to JS via
/// `NativeModules.NavigationBar`, faithfully porting Expo's `expo-navigation-bar` native method surface.
@LynxNativeModule("NavigationBar")
@interface NavigationBar : NSObject <NavigationBarSpec>

- (void)setBackgroundColor:(NSString *)color;
- (void)setButtonStyle:(NSString *)style;
- (void)setVisibility:(BOOL)visible;
- (id)getVisibility;

@end

NS_ASSUME_NONNULL_END
