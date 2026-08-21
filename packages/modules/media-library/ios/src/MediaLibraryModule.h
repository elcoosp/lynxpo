// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "MediaLibraryModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `MediaLibraryModule`. Exposes media library to JS via
/// `NativeModules.MediaLibraryModule`, faithfully porting Expo's `expo-media-library` native
/// method surface.
@LynxNativeModule("MediaLibraryModule")
@interface MediaLibraryModule : NSObject <MediaLibraryModuleSpec>

- (id)permissionsAsync;
- (void)requestPermission;
- (id)albumsAsync;
- (id)assetsAsync;
@end

NS_ASSUME_NONNULL_END
