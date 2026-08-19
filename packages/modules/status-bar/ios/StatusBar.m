// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "StatusBar.h"
#import <Foundation/Foundation.h>

@implementation StatusBar

+ (NSString *)name {
 return @"StatusBar";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"setStyle" : NSStringFromSelector(@selector(setStyleWithStyle:(NSString *)style)),
  @"setHidden" : NSStringFromSelector(@selector(setHiddenWithHidden:(BOOL)hidden)),
  @"setNetworkActivityIndicatorVisible" : NSStringFromSelector(@selector(setNetworkActivityIndicatorVisibleWithVisible:(BOOL)visible)),
  @"setBackgroundColor" : NSStringFromSelector(@selector(setBackgroundColorWithColor:(NSString *)color)),
 };
}

- (void)setStyleWithStyle:(NSString *)style {
}

- (void)setHiddenWithHidden:(BOOL)hidden {
}

- (void)setNetworkActivityIndicatorVisibleWithVisible:(BOOL)visible {
}

- (void)setBackgroundColorWithColor:(NSString *)color {
}

@end
