// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Sharing.h"
#import <Foundation/Foundation.h>

@implementation Sharing

- (BOOL)isAvailable {
  return NO;
}

- (void)shareAsync:(NSString *)url {
  (void)url;
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailable" : NSStringFromSelector(@selector(isAvailable)),
    @"shareAsync" : NSStringFromSelector(@selector(shareAsync)),
  };
}
@end
