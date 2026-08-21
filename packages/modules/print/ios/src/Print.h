// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "PrintSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `Print`. Exposes native functionality to JS via
/// `NativeModules.Print`, faithfully porting Expo's `expo-print` native method surface.
@LynxNativeModule("Print")
@interface Print : NSObject <PrintSpec>

- (void)printAsync:(NSString *)uri;
- (id)selectPrinter;
- (BOOL)isAvailable;

@end

NS_ASSUME_NONNULL_END
