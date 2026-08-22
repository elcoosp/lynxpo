// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import "DocumentPicker.h"
#import <Foundation/Foundation.h>

@implementation DocumentPicker

- (id)documentAsync:(NSString *)options {
  (void)options;
  return @{};
}

- (BOOL)isAvailableAsync {
  return NO;
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"documentAsync" : NSStringFromSelector(@selector(documentAsync)),
    @"isAvailableAsync" : NSStringFromSelector(@selector(isAvailableAsync)),
  };
}
@end
