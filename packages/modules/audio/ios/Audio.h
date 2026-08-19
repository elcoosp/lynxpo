// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `Audio`. Exposes native functionality to JS via
/// `NativeModules.Audio`, faithfully porting Expo's `expo-audio` native method surface.
@interface Audio : NSObject <LynxModule>

- (NSDictionary *)getStatus;
- (void)play;
- (void)pause;
- (void)setVolumeWithVolume:(double)volume;
- (void)setIsLoopingWithLooping:(BOOL)looping;

@end

NS_ASSUME_NONNULL_END
