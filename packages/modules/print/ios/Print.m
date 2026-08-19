// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Print.h"
#import <Foundation/Foundation.h>

@implementation Print

+ (NSString *)name {
 return @"Print";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"printAsync" : NSStringFromSelector(@selector(printAsyncWithUri:(NSString *)uri)),
  @"selectPrinter" : NSStringFromSelector(@selector(selectPrinter)),
  @"isAvailable" : NSStringFromSelector(@selector(isAvailable)),
 };
}

- (void)printAsyncWithUri:(NSString *)uri {
}

- (NSDictionary *)selectPrinter {
 return @{ @"name": @"", @"isAvailable": @NO };
}

- (BOOL)isAvailable {
 return YES;
}

@end
