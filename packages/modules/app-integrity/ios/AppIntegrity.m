// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <LynxModule/LynxModule.h>
#import <DeviceCheck/DeviceCheck.h>

@interface AppIntegrity () <LynxModule>
@end

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

- (BOOL)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  // DeviceCheck (and thus App Attest / attestation) is available on iOS 11+.
  if (@available(iOS 11.0, *)) {
    resolve(@(YES));
  } else {
    resolve(@(NO));
  }
  return YES;
}

- (NSDictionary *)integrityTokenAsync:(NSString *)options resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if (@available(iOS 14.0, *)) {
    result[@"available"] = @(YES);
    result[@"token"] = @(NO);
    result[@"error"] = @"App Attest key + assertion requires a server-side attestation "
                        "object exchange (DCAppAttestService + backend verification). Not "
                        "performed on-device.";
    result[@"source"] = @"DeviceCheck";
  } else {
    result[@"available"] = @(NO);
    result[@"error"] = @"DeviceCheck unavailable on this iOS version.";
  }
  resolve(result);
  return YES;
}

- (NSDictionary *)codeHashAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  // App Attest key id is generated on demand and stored server-side; we report
  // availability rather than fabricating an id.
  if (@available(iOS 14.0, *)) {
    result[@"available"] = @(YES);
    result[@"source"] = @"DeviceCheck";
    result[@"note"] = @"App Attest generates a per-device key id via DCAppAttestService."
                       "generateKeyWithCompletionHandler: and verifies it server-side.";
  } else {
    result[@"available"] = @(NO);
  }
  resolve(result);
  return YES;
}

@end
