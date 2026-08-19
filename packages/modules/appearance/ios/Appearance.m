// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Appearance.h"
#import <Foundation/Foundation.h>

@implementation Appearance

+ (NSString *)name {
 return @"Appearance";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"getColorScheme" : NSStringFromSelector(@selector(getColorScheme)),
  @"setColorScheme" : NSStringFromSelector(@selector(setColorSchemeWithScheme:(NSString *)scheme)),
 };
}

- (NSString *)getColorScheme {
 return @"light";
}

- (void)setColorSchemeWithScheme:(NSString *)scheme {
}

@end
