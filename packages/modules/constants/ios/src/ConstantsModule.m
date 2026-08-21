// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "ConstantsModule.h"
#import <UIKit/UIKit.h>

@implementation ConstantsModule



- (NSString *)appOwnership {
  // Lynxpo runs as a bare app, mirroring Expo's bare workflow.
  return @"bare";
}

- (NSString *)platform {
  return @"ios";
}

- (NSString *)executionEnvironment {
  return @"bare";
}

- (NSString *)sessionId {
  return [[NSUUID UUID] UUIDString];
}

- (NSString *)installationId {
  return [[[UIDevice currentDevice] identifierForVendor] UUIDString] ?: @"";
}

- (BOOL)isHeadless {
  return NO;
}

- (NSArray<NSString *> *)systemFonts {
  NSArray<NSString *> *families = [UIFont familyNames];
  return families ?: @[];
}

- (NSDictionary<NSString *, NSString *> *)version {
  NSDictionary *info = [[NSBundle mainBundle] infoDictionary];
  NSString *build = info[@"CFBundleVersion"] ?: @"";
  return @{ @"nativeBuildVersion" : build, @"sdkVersion" : [NSNull null] };
}

@end
