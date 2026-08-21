// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "AuthSession.h"

@implementation AuthSession



- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync" : @"isAvailableAsync:",
    @"redirectUriAsync" : @"redirectUriAsync:",
    @"providerInfoAsync" : @"providerInfoAsync:",
  };
}

- (BOOL)isAvailableAsync {

  return @(YES);
}

- (NSString *)redirectUri {
  NSBundle *b = [NSBundle mainBundle];
  NSString *bid = b.bundleIdentifier ?: @"com.lynx.explorer";
  NSArray *parts = [bid componentsSeparatedByString:@"."];
  NSArray *reversed = [[parts reverseObjectEnumerator] allObjects];
  NSString *scheme = [NSString stringWithFormat:@"com.%@", [reversed componentsJoinedByString:@"."]];
  return [scheme stringByAppendingString:@"://expo-auth-session"];
}

- (NSString *)redirectUriAsync {

  return [self redirectUri];
}

- (id)providerInfoAsync {

  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  result[@"available"] = @(YES);
  result[@"scheme"] = [self redirectUri];
  // iOS does not expose installed apps by bundle id (privacy). Report the
  // system browsers that can handle OAuth instead.
  result[@"google"] = @(NO);
  result[@"facebook"] = @(NO);
  result[@"source"] = @"ios-discovery";
  return result;
}

@end
