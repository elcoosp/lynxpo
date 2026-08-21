// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "ClipboardModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `ClipboardModule`. Exposes device info to JS via
/// `NativeModules.ClipboardModule`, faithfully porting Expo's native method surface.
@LynxNativeModule("ClipboardModule")
@interface ClipboardModule : NSObject <ClipboardModuleSpec>

- (NSString *)getString;
- (void)setString:(NSString *)text;
- (BOOL)hasString;
@end

NS_ASSUME_NONNULL_END
