// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <LynxModule/LynxModule.h>

@interface ImageManipulator() <LynxModule>
@end

@implementation ImageManipulator

+ (NSString *)name {
  return @"ImageManipulator";
}

- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"manipulateAsync": @"manipulateAsyncWithUri:actions:saveOptions:",
    @"isAvailableAsync": @"isAvailableAsyncWithUri:",
  };
}

- (NSDictionary *)manipulateAsyncWithUri:(NSString *)uri actions:(NSString *)actions saveOptions:(NSString *)saveOptions {
  return @{};
}

- (BOOL)isAvailableAsyncWithUri:(NSString *)uri {
  return NO;
}

@end
