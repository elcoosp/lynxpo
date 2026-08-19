// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <LynxModule/LynxModule.h>

@interface VideoThumbnails() <LynxModule>
@end

@implementation VideoThumbnails

+ (NSString *)name {
  return @"VideoThumbnails";
}

- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"thumbnailAsync": @"thumbnailAsyncWithSource:",
    @"isAvailableAsync": @"isAvailableAsync:",
  };
}

- (NSDictionary *)thumbnailAsyncWithSource: WithSource:(NSString *)source options:(NSString *)options {
  return @{};
}

- (BOOL)isAvailableAsync: {
  return NO;
}

@end
