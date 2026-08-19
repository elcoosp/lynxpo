// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "SystemUi.h"
#import <Foundation/Foundation.h>

@implementation SystemUi

+ (NSString *)name {
 return @"SystemUi";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"getBackgroundColor" : NSStringFromSelector(@selector(getBackgroundColor)),
  @"setBackgroundColor" : NSStringFromSelector(@selector(setBackgroundColorWithColor:(NSString *)color)),
  @"setStatusBarBackgroundColor" : NSStringFromSelector(@selector(setStatusBarBackgroundColorWithColor:(NSString *)color)),
 };
}

- (NSString *)getBackgroundColor {
 return @"#000000";
}

- (void)setBackgroundColorWithColor:(NSString *)color {
}

- (void)setStatusBarBackgroundColorWithColor:(NSString *)color {
}

@end
