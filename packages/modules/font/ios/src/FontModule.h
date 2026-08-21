// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "FontModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `FontModule`. Exposes font loading to JS via
/// `NativeModules.FontModule`, faithfully porting Expo's `expo-font` native
/// method surface.
@LynxNativeModule("FontModule")
@interface FontModule : NSObject <FontModuleSpec>

- (BOOL)isLoaded:(NSString *)fontFamily;
- (id)loadedFonts;
- (NSString *)processFontFamily:(NSString *)fontFamily;
- (void)loadAsync:(NSString *)fontFamily;
@end

NS_ASSUME_NONNULL_END
