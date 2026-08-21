// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "WebBrowserModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `WebBrowserModule`. Exposes web-browser availability to JS
/// via `NativeModules.WebBrowserModule`, faithfully porting Expo's `expo-web-browser` native
/// method surface.
@LynxNativeModule("WebBrowserModule")
@interface WebBrowserModule : NSObject <WebBrowserModuleSpec>

- (BOOL)isAvailable;
- (NSString *)initialURL;
@end

NS_ASSUME_NONNULL_END
