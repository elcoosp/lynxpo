// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "TrackingTransparency.h"
#import <Foundation/Foundation.h>

@implementation TrackingTransparency

+ (NSString *)name {
 return @"TrackingTransparency";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"getAuthorizationStatus" : NSStringFromSelector(@selector(getAuthorizationStatus)),
  @"requestAuthorization" : NSStringFromSelector(@selector(requestAuthorization)),
 };
}

- (NSString *)getAuthorizationStatus {
 return @"notDetermined";
}

- (NSString *)requestAuthorization {
 return @"notDetermined";
}

@end
