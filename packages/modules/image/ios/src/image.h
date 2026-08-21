// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "ImageSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `Image`. Exposes native functionality to JS via
/// `NativeModules.Image`, faithfully porting Expo's `expo-image` native method surface.
@LynxNativeModule("Image")
@interface Image : NSObject <ImageSpec>

- (double)getCacheSize;
- (void)clearCache;
- (BOOL)prefetch:(NSString *)url;
- (BOOL)isImageLoading:(NSString *)uri;
- (void)cancelLoading:(NSString *)uri;

@end

NS_ASSUME_NONNULL_END
