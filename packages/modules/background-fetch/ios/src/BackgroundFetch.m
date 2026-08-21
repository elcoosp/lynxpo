// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "BackgroundFetch.h"
#import <Foundation/Foundation.h>

@implementation BackgroundFetch

- (id)getStatus {
  return @{ @"status": @0 };
}

- (void)registerTaskAsync:(NSString *)taskName {
  (void)taskName;
}

- (void)unregisterTaskAsync:(NSString *)taskName {
  (void)taskName;
}

@end
