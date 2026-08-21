// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "MusicLibrarySpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `MusicLibrary`. Exposes native functionality to JS via
/// `NativeModules.MusicLibrary`, faithfully porting Expo's `expo-music-library` native method surface.
@LynxNativeModule("MusicLibrary")
@interface MusicLibrary : NSObject <MusicLibrarySpec>

- (id)getAlbums;
- (id)getSongs:(NSString *)albumId;
- (id)requestPermissions;
- (id)getPermissions;

@end

NS_ASSUME_NONNULL_END
