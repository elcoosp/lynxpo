// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <LynxModule/LynxModule.h>

@interface DocumentPicker() <LynxModule>
@end

@implementation DocumentPicker

+ (NSString *)name {
  return @"DocumentPicker";
}

- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"documentAsync": @"documentAsyncWithOptions:",
    @"isAvailableAsync": @"isAvailableAsync:",
  };
}

- (NSDictionary *)documentAsyncWithOptions: WithOptions:(NSString *)options {
  return @{};
}

- (BOOL)isAvailableAsync: {
  return NO;
}

@end
