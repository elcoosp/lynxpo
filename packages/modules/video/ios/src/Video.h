// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "VideoSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `Video`. Exposes native functionality to JS via
/// `NativeModules.Video`, faithfully porting Expo's `expo-video` native method surface.
@LynxNativeModule("Video")
@interface Video : NSObject <VideoSpec>

- (id)getStatus;
- (void)play;
- (void)pause;
- (void)setVolume:(double)volume;
- (void)setMuted:(BOOL)muted;

@end

NS_ASSUME_NONNULL_END
