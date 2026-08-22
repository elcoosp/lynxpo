// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import "Health.h"
#import <Foundation/Foundation.h>

@implementation Health



- (BOOL)isAvailableAsync {
  // HealthKit is unavailable in the LynxPo simulator showcase.
  return NO;
}

- (id)permissionsAsync {
  return @{};
}

- (id)requestPermissionsAsync:(NSString *)permissions {
  (void)permissions;
  return @{};
}

- (id)recordsAsync:(NSString *)options {
  (void)options;
  return @[];
}

- (id)writeRecordsAsync:(NSString *)records {
  (void)records;
  return @{};
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync" : NSStringFromSelector(@selector(isAvailableAsync)),
    @"permissionsAsync" : NSStringFromSelector(@selector(permissionsAsync)),
    @"recordsAsync" : NSStringFromSelector(@selector(recordsAsync)),
    @"requestPermissionsAsync" : NSStringFromSelector(@selector(requestPermissionsAsync)),
    @"writeRecordsAsync" : NSStringFromSelector(@selector(writeRecordsAsync)),
  };
}
@end
