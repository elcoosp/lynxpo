// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `BackgroundFetch`. Exposes native functionality to JS via
/// `NativeModules.BackgroundFetch`, faithfully porting Expo's `expo-background-fetch` native method surface.
@interface BackgroundFetch : NSObject <LynxModule>

- (NSDictionary *)getStatus;
- (void)registerTaskAsyncWithTaskName:(NSString *)taskName;
- (void)unregisterTaskAsyncWithTaskName:(NSString *)taskName;

@end

NS_ASSUME_NONNULL_END
