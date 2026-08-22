// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "ScreenCapture.h"

@implementation ScreenCapture

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


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"allowScreenCapture" : NSStringFromSelector(@selector(allowScreenCapture)),
    @"isAvailableAsync" : NSStringFromSelector(@selector(isAvailableAsync)),
    @"permissionsAsync" : NSStringFromSelector(@selector(permissionsAsync)),
    @"preventScreenCapture" : NSStringFromSelector(@selector(preventScreenCapture)),
    @"requestPermissionsAsync" : NSStringFromSelector(@selector(requestPermissionsAsync)),
  };
}
@end
