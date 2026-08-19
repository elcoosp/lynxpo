// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <LynxModule/LynxModule.h>

@interface BackgroundTask() <LynxModule>
@end

@implementation BackgroundTask

+ (NSString *)name {
  return @"BackgroundTask";
}

- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync": @"isAvailableAsync:",
    @"registerTaskAsync": @"registerTaskAsyncWithTaskname:",
    @"unregisterTaskAsync": @"unregisterTaskAsyncWithTaskname:",
    @"getStatusAsync": @"getStatusAsync:",
  };
}

- (BOOL)isAvailableAsync: {
  return NO;
}

- (BOOL)registerTaskAsyncWithTaskname: WithTaskname:(NSString *)taskName options:(NSString *)options {
  return NO;
}

- (BOOL)unregisterTaskAsyncWithTaskname: WithTaskname:(NSString *)taskName {
  return NO;
}

- (NSDictionary *)getStatusAsync: {
  return @{};
}

@end
