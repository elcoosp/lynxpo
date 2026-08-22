// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "WebBrowserModule.h"

@implementation WebBrowserModule



- (BOOL)isAvailable {
  return YES;
}

- (NSString *)initialURL {
  return @"";
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"initialURL" : NSStringFromSelector(@selector(initialURL)),
    @"isAvailable" : NSStringFromSelector(@selector(isAvailable)),
  };
}
@end
