// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Video.h"
#import <Foundation/Foundation.h>

@implementation Video

- (id)getStatus {
  return @{ @"isPlaying": @NO, @"position": @0.0, @"duration": @0.0, @"isMuted": @NO, @"volume": @1.0 };
}

- (void)play {
}

- (void)pause {
}

- (void)setVolume:(double)volume {
  (void)volume;
}

- (void)setMuted:(BOOL)muted {
  (void)muted;
}

@end
