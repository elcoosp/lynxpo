// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "BackgroundFetchSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `BackgroundFetch`. Exposes native functionality to JS via
/// `NativeModules.BackgroundFetch`, faithfully porting Expo's `expo-background-fetch` native method surface.
@LynxNativeModule("BackgroundFetch")
@interface BackgroundFetch : NSObject <BackgroundFetchSpec>

- (id)getStatus;
- (void)registerTaskAsync:(NSString *)taskName;
- (void)unregisterTaskAsync:(NSString *)taskName;

@end

NS_ASSUME_NONNULL_END
