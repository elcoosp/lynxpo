// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "TaskManager.h"
#import <Foundation/Foundation.h>

@implementation TaskManager

+ (NSString *)name {
 return @"TaskManager";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"isTaskRegistered" : NSStringFromSelector(@selector(isTaskRegisteredWithTaskName:(NSString *)taskName)),
  @"getRegisteredTasks" : NSStringFromSelector(@selector(getRegisteredTasks)),
  @"unregisterTaskAsync" : NSStringFromSelector(@selector(unregisterTaskAsyncWithTaskName:(NSString *)taskName)),
 };
}

- (BOOL)isTaskRegisteredWithTaskName:(NSString *)taskName {
 return NO;
}

- (NSArray *)getRegisteredTasks {
 return @[];
}

- (void)unregisterTaskAsyncWithTaskName:(NSString *)taskName {
}

@end
