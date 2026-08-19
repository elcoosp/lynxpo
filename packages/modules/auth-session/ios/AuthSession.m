// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <LynxModule/LynxModule.h>
#import <UIKit/UIKit.h>

@interface AuthSession () <LynxModule>
@end

@implementation AuthSession

+ (NSString *)name {
  return @"AuthSession";
}

- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync" : @"isAvailableAsync:",
    @"redirectUriAsync" : @"redirectUriAsync:",
    @"providerInfoAsync" : @"providerInfoAsync:",
  };
}

- (BOOL)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@(YES));
  return YES;
}

- (NSString *)redirectUriAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  NSString *bundleId = [[NSBundle mainBundle] bundleIdentifier] ?: @"";
  NSString *reversed = [[[bundleId componentsSeparatedByString:@"."] reverseObjectEnumerator].allObjects
      componentsJoinedByString:@"."];
  NSString *uri = [NSString stringWithFormat:@"%@://expo-auth-session", reversed];
  resolve(uri);
  return YES;
}

- (NSDictionary *)providerInfoAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  result[@"available"] = @(YES);
  // Detect native OAuth handlers via URL scheme registration.
  BOOL google = [[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"com.googleusercontent.apps://"]];
  BOOL facebook = [[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"fb://"]];
  result[@"google"] = @(google);
  result[@"facebook"] = @(facebook);
  result[@"scheme"] = [self redirectUriAsync:resolve reject:reject] ? : @"";
  result[@"source"] = @"UIApplication";
  resolve(result);
  return YES;
}

@end
