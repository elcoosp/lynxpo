// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import "BackgroundTask.h"
#import <Foundation/Foundation.h>

@implementation BackgroundTask

- (BOOL)isAvailableAsync {
  return NO;
}

- (BOOL)registerTaskAsync:(NSString *)taskName options:(NSString *)options {
  (void)taskName;
  (void)options;
  return NO;
}

- (BOOL)unregisterTaskAsync:(NSString *)taskName {
  (void)taskName;
  return NO;
}

- (id)getStatus {
  return @{};
}

@end
