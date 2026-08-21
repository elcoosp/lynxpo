// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "ScreenCapture.h"

@implementation ScreenCapture



- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync": @"isAvailableAsync:",
    @"preventScreenCapture": @"preventScreenCapture:",
    @"allowScreenCapture": @"allowScreenCapture:",
    @"permissionsAsync": @"permissionsAsync:",
    @"requestPermissionsAsync": @"requestPermissionsAsync:",
  };
}

- (BOOL)isAvailableAsync {

  return @(YES);
}

- (BOOL)preventScreenCapture {

  return @(YES);
}

- (BOOL)allowScreenCapture {

  return @(YES);
}

- (id)permissionsAsync {

  NSDictionary *result = @{@"granted": @(YES), @"status": @"granted", @"canAskAgain": @(YES), @"expires": @"never"};
  return result;
}

- (id)requestPermissionsAsync {

  NSDictionary *result = @{@"granted": @(YES), @"status": @"granted", @"canAskAgain": @(YES), @"expires": @"never"};
  return result;
}

@end
