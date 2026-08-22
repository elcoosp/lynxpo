// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "SystemUi.h"
#import <Foundation/Foundation.h>

@implementation SystemUi

- (NSString *)getBackgroundColor {
  return @"#000000";
}

- (void)setBackgroundColor:(NSString *)color {
  (void)color;
}

- (void)setStatusBarBackgroundColor:(NSString *)color {
  (void)color;
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"getBackgroundColor" : NSStringFromSelector(@selector(getBackgroundColor)),
    @"setBackgroundColor" : NSStringFromSelector(@selector(setBackgroundColor)),
    @"setStatusBarBackgroundColor" : NSStringFromSelector(@selector(setStatusBarBackgroundColor)),
  };
}
@end
