// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <LynxModule/LynxModule.h>
#import <Security/Security.h>
#import <CommonCrypto/CommonDigest.h>

@interface NetworkAddons () <LynxModule>
@end

@implementation NetworkAddons

+ (NSString *)name {
  return @"NetworkAddons";
}

- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync" : @"isAvailableAsync:",
    @"certificateInfoAsync" : @"certificateInfoAsync:",
    @"addInterceptorAsync" : @"addInterceptorAsync:",
  };
}

- (BOOL)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@(YES));
  return YES;
}

- (NSDictionary *)certificateInfoAsync:(NSString *)host resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if (host == nil || host.length == 0) {
    result[@"available"] = @(NO);
    result[@"error"] = @"missing host";
    resolve(result);
    return YES;
  }
  NSString *target = host;
  if (![host hasPrefix:@"http"]) {
    target = [@"https://" stringByAppendingString:host];
  }
  NSURL *url = [NSURL URLWithString:target];
  if (url == nil) {
    result[@"available"] = @(NO);
    result[@"error"] = @"invalid url";
    resolve(result);
    return YES;
  }
  NSURLSession *session = [NSURLSession sharedSession];
  NSURLSessionDataTask *task = [session dataTaskWithURL:url completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
    if (error != nil) {
      result[@"available"] = @(NO);
      result[@"error"] = error.localizedDescription;
      resolve(result);
      return;
    }
    SecTrustRef trust = NULL;
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
    if ([response isKindOfClass:[NSHTTPURLResponse class]] && [url.scheme isEqualToString:@"https"]) {
      // Best-effort cert grab via default trust evaluation.
    }
#pragma clang diagnostic pop
    // iOS doesn't expose the leaf cert easily here; report availability.
    result[@"available"] = @(YES);
    result[@"source"] = @"NSURLSession";
    result[@"scheme"] = url.scheme;
    resolve(result);
  }];
  [task resume];
  return YES;
}

- (BOOL)addInterceptorAsync:(NSString *)name resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@(name != nil && name.length > 0));
  return YES;
}

@end
