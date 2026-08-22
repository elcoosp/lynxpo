// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Print.h"
#import <Foundation/Foundation.h>

@implementation Print

- (void)printAsync:(NSString *)uri {
  (void)uri;
}

- (id)selectPrinter {
  return @{};
}

- (BOOL)isAvailable {
  return NO;
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailable" : NSStringFromSelector(@selector(isAvailable)),
    @"printAsync" : NSStringFromSelector(@selector(printAsync)),
    @"selectPrinter" : NSStringFromSelector(@selector(selectPrinter)),
  };
}
@end
