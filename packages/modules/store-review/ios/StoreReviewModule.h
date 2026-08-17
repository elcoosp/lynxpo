// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `StoreReviewModule`. Exposes device info to JS via
/// `NativeModules.StoreReviewModule`, faithfully porting Expo's native method surface.
@interface StoreReviewModule : NSObject <LynxModule>

- (BOOL)isAvailable;
- (void)requestReview;
@end

NS_ASSUME_NONNULL_END
