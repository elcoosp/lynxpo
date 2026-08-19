// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `Image`. Exposes native functionality to JS via
/// `NativeModules.Image`, faithfully porting Expo's `expo-image` native method surface.
@interface Image : NSObject <LynxModule>

- (double)getCacheSize;
- (void)clearCache;
- (BOOL)prefetchWithUrl:(NSString *)url;
- (BOOL)isImageLoadingWithUri:(NSString *)uri;
- (void)cancelLoadingWithUri:(NSString *)uri;

@end

NS_ASSUME_NONNULL_END
