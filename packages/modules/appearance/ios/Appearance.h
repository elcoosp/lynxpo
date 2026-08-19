// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `Appearance`. Exposes native functionality to JS via
/// `NativeModules.Appearance`, faithfully porting Expo's `expo-appearance` native method surface.
@interface Appearance : NSObject <LynxModule>

- (NSString *)getColorScheme;
- (void)setColorSchemeWithScheme:(NSString *)scheme;

@end

NS_ASSUME_NONNULL_END
