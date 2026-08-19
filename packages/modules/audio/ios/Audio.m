// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Audio.h"
#import <Foundation/Foundation.h>

@implementation Audio

+ (NSString *)name {
 return @"Audio";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"getStatus" : NSStringFromSelector(@selector(getStatus)),
  @"play" : NSStringFromSelector(@selector(play)),
  @"pause" : NSStringFromSelector(@selector(pause)),
  @"setVolume" : NSStringFromSelector(@selector(setVolumeWithVolume:(double)volume)),
  @"setIsLooping" : NSStringFromSelector(@selector(setIsLoopingWithLooping:(BOOL)looping)),
 };
}

- (NSDictionary *)getStatus {
 return @{ @"isPlaying": @NO, @"duration": @0.0, @"position": @0.0, @"isMuted": @NO, @"volume": @1.0, @"isLooping": @NO };
}

- (void)play {
}

- (void)pause {
}

- (void)setVolumeWithVolume:(double)volume {
}

- (void)setIsLoopingWithLooping:(BOOL)looping {
}

@end
