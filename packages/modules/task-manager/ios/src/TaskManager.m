// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "TaskManager.h"
#import <Foundation/Foundation.h>

@implementation TaskManager

- (BOOL)isTaskRegistered:(NSString *)taskName {
  (void)taskName;
  return NO;
}

- (id)getRegisteredTasks {
  return @[];
}

- (void)unregisterTaskAsync:(NSString *)taskName {
  (void)taskName;
}

@end
