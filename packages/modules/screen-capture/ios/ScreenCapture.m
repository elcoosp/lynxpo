// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <LynxModule/LynxModule.h>

@interface ScreenCapture () <LynxModule>
@end

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

- (BOOL)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@(YES));
}

- (BOOL)preventScreenCapture:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@(YES));
}

- (BOOL)allowScreenCapture:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@(YES));
}

- (NSDictionary *)permissionsAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  NSDictionary *result = @{@"granted": @(YES), @"status": @"granted", @"canAskAgain": @(YES), @"expires": @"never"};
  resolve(result);
}

- (NSDictionary *)requestPermissionsAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  NSDictionary *result = @{@"granted": @(YES), @"status": @"granted", @"canAskAgain": @(YES), @"expires": @"never"};
  resolve(result);
}

@end
