// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import <DeviceCheck/DeviceCheck.h>
#import "AppIntegrity.h"

@implementation AppIntegrity

+ (NSString *)name {
  return @"AppIntegrity";
}

- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync" : @"isAvailableAsync:",
    @"integrityTokenAsync" : @"integrityTokenAsync:",
    @"codeHashAsync" : @"codeHashAsync:",
  };
}

- (void)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  BOOL available = NO;
  if (@available(iOS 14.0, *)) {
    available = [DCDevice.currentDevice isSupported];
  }
  resolve(@(available));
}

- (void)integrityTokenAsync:(NSString *)options
                    resolve:(LynxCallbackBlock)resolve
                     reject:(LynxCallbackBlock)reject {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  result[@"available"] = @(NO);
  if (@available(iOS 14.0, *)) {
    if ([DCDevice.currentDevice isSupported]) {
      [DCDevice.currentDevice generateTokenWithCompletionHandler:^(NSData * _Nullable token, NSError * _Nullable error) {
        if (error) {
          NSMutableDictionary *r = [NSMutableDictionary dictionary];
          r[@"available"] = @(YES);
          r[@"token"] = @(NO);
          r[@"error"] = error.localizedDescription;
          r[@"source"] = @"DeviceCheck";
          resolve(r);
        } else {
          NSString *b64 = [token base64EncodedStringWithOptions:0];
          NSMutableDictionary *r = [NSMutableDictionary dictionary];
          r[@"available"] = @(YES);
          r[@"token"] = b64 ?: @"";
          r[@"source"] = @"DeviceCheck";
          resolve(r);
        }
      }];
      return;
    }
  }
  result[@"error"] = @"DeviceCheck is not supported on this device/iOS version.";
  result[@"source"] = @"DeviceCheck";
  resolve(result);
}

- (void)codeHashAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  result[@"available"] = @(NO);
  result[@"error"] = @"App signing-certificate SHA-256 requires a packaged IPA (TestFlight/App Store). The debug build is not signed by Apple.";
  result[@"source"] = @"Bundle";
  resolve(result);
}

@end
