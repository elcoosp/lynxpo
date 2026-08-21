// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Audio.h"
#import <Foundation/Foundation.h>

@implementation Audio



- (id)getStatus {
  return @{ @"isPlaying": @NO, @"duration": @0.0, @"position": @0.0,
            @"isMuted": @NO, @"volume": @1.0, @"isLooping": @NO };
}

- (void)play {
  // LynxPo showcase: no real audio engine on the simulator; kept for API parity.
}

- (void)pause {
  // LynxPo showcase: no real audio engine on the simulator; kept for API parity.
}

- (void)setVolume:(double)volume {
  (void)volume;
}

- (void)setIsLooping:(BOOL)looping {
  (void)looping;
}

@end
