// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Sharing.h"
#import <Foundation/Foundation.h>

@implementation Sharing

+ (NSString *)name {
 return @"Sharing";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"isAvailable" : NSStringFromSelector(@selector(isAvailable)),
  @"shareAsync" : NSStringFromSelector(@selector(shareAsyncWithUrl:(NSString *)url)),
 };
}

- (BOOL)isAvailable {
 return YES;
}

- (void)shareAsyncWithUrl:(NSString *)url {
}

@end
