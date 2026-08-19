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
    @"permissionsAsync": @"permissionsAsync:",
    @"requestPermissionsAsync": @"requestPermissionsAsyncWithPermissions:",
    @"recordsAsync": @"recordsAsyncWithOptions:",
    @"writeRecordsAsync": @"writeRecordsAsyncWithRecords:",
  };
}

- (BOOL)isAvailableAsync: {
  return NO;
}

- (NSDictionary *)permissionsAsync: {
  return @{};
}

- (NSDictionary *)requestPermissionsAsyncWithPermissions: (NSString *)permissions {
  return @{};
}

- (NSDictionary *)recordsAsyncWithOptions: (NSString *)options {
  return @{};
}

- (NSDictionary *)writeRecordsAsyncWithRecords: (NSString *)records {
  return @{};
}

@end
