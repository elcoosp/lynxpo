// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import "VideoThumbnails.h"
#import <Foundation/Foundation.h>

@implementation VideoThumbnails

- (id)thumbnailAsync:(NSString *)source options:(NSString *)options {
  (void)source;
  (void)options;
  return @{};
}

- (BOOL)isAvailableAsync {
  return NO;
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync" : NSStringFromSelector(@selector(isAvailableAsync)),
    @"thumbnailAsync" : NSStringFromSelector(@selector(thumbnailAsync:options:)),
  };
}
@end
