// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <LynxModule/LynxModule.h>

@interface Health() <LynxModule>
@end

@implementation Health

+ (NSString *)name {
  return @"Health";
}

- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync": @"isAvailableAsync:",
    @"getPermissionsAsync": @"getPermissionsAsync:",
    @"requestPermissionsAsync": @"requestPermissionsAsyncWithPermissions:",
    @"getRecordsAsync": @"getRecordsAsyncWithOptions:",
    @"writeRecordsAsync": @"writeRecordsAsyncWithRecords:",
  };
}

- (BOOL)isAvailableAsync: {
  return NO;
}

- (NSDictionary *)getPermissionsAsync: {
  return @{};
}

- (NSDictionary *)requestPermissionsAsyncWithPermissions: (NSString *)permissions {
  return @{};
}

- (NSDictionary *)getRecordsAsyncWithOptions: (NSString *)options {
  return @{};
}

- (NSDictionary *)writeRecordsAsyncWithRecords: (NSString *)records {
  return @{};
}

@end
