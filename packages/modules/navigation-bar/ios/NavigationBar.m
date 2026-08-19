// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "NavigationBar.h"
#import <Foundation/Foundation.h>

@implementation NavigationBar

+ (NSString *)name {
 return @"NavigationBar";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"setBackgroundColor" : NSStringFromSelector(@selector(setBackgroundColorWithColor:(NSString *)color)),
  @"setButtonStyle" : NSStringFromSelector(@selector(setButtonStyleWithStyle:(NSString *)style)),
  @"setVisibility" : NSStringFromSelector(@selector(setVisibilityWithVisible:(BOOL)visible)),
  @"getVisibility" : NSStringFromSelector(@selector(getVisibility)),
 };
}

- (void)setBackgroundColorWithColor:(NSString *)color {
}

- (void)setButtonStyleWithStyle:(NSString *)style {
}

- (void)setVisibilityWithVisible:(BOOL)visible {
}

- (NSDictionary *)getVisibility {
 return @{ @"visible": @YES };
}

@end
