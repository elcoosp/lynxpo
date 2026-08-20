// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "ScreenCapture.h"

@implementation ScreenCapture

+ (NSString *)name {
  return @"ScreenCapture";
}

- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync": @"isAvailableAsync:",
    @"preventScreenCapture": @"preventScreenCapture:",
    @"allowScreenCapture": @"allowScreenCapture:",
    @"permissionsAsync": @"permissionsAsync:",
    @"requestPermissionsAsync": @"requestPermissionsAsync:",
  };
}

- (void)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@(YES));
}

- (void)preventScreenCapture:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@(YES));
}

- (void)allowScreenCapture:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@(YES));
}

- (void)permissionsAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  NSDictionary *result = @{@"granted": @(YES), @"status": @"granted", @"canAskAgain": @(YES), @"expires": @"never"};
  resolve(result);
}

- (void)requestPermissionsAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  NSDictionary *result = @{@"granted": @(YES), @"status": @"granted", @"canAskAgain": @(YES), @"expires": @"never"};
  resolve(result);
}

@end
