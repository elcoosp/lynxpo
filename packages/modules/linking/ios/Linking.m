// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Linking.h"
#import <Foundation/Foundation.h>

@implementation Linking

+ (NSString *)name {
 return @"Linking";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"getInitialURL" : NSStringFromSelector(@selector(getInitialURL)),
  @"canOpenURL" : NSStringFromSelector(@selector(canOpenURLWithUrl:(NSString *)url)),
  @"openURL" : NSStringFromSelector(@selector(openURLWithUrl:(NSString *)url)),
 };
}

- (NSString *)getInitialURL {
 return @"";
}

- (BOOL)canOpenURLWithUrl:(NSString *)url {
 return YES;
}

- (void)openURLWithUrl:(NSString *)url {
}

@end
