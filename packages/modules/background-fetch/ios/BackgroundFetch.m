// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "BackgroundFetch.h"
#import <Foundation/Foundation.h>

@implementation BackgroundFetch

+ (NSString *)name {
 return @"BackgroundFetch";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"getStatus" : NSStringFromSelector(@selector(getStatus)),
  @"registerTaskAsync" : NSStringFromSelector(@selector(registerTaskAsyncWithTaskName:(NSString *)taskName)),
  @"unregisterTaskAsync" : NSStringFromSelector(@selector(unregisterTaskAsyncWithTaskName:(NSString *)taskName)),
 };
}

- (NSDictionary *)getStatus {
 return @{ @"status": @0 };
}

- (void)registerTaskAsyncWithTaskName:(NSString *)taskName {
}

- (void)unregisterTaskAsyncWithTaskName:(NSString *)taskName {
}

@end
