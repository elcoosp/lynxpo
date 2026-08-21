// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "LinkingSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `Linking`. Exposes native functionality to JS via
/// `NativeModules.Linking`, faithfully porting Expo's `expo-linking` native method surface.
@LynxNativeModule("Linking")
@interface Linking : NSObject <LinkingSpec>

- (NSString *)getInitialURL;
- (BOOL)canOpenURL:(NSString *)url;
- (void)openURL:(NSString *)url;

@end

NS_ASSUME_NONNULL_END
