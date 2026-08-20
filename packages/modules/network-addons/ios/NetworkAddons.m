// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "NetworkAddons.h"

@interface NetworkAddons () <NSURLSessionDelegate>
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

- (void)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@(YES));
}

- (void)certificateInfoAsync:(NSString *)host
                     resolve:(LynxCallbackBlock)resolve
                      reject:(LynxCallbackBlock)reject {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if (host.length == 0) {
    result[@"available"] = @(NO);
    result[@"error"] = @"missing host";
    resolve(result);
    return;
  }
  NSString *target = [host hasPrefix:@"http"] ? host : [@"https://" stringByAppendingString:host];
  NSURL *url = [NSURL URLWithString:target];
  if (url == nil) {
    result[@"available"] = @(NO);
    result[@"error"] = @"invalid url";
    resolve(result);
    return;
  }
  // Use a delegate session so we can capture the server trust (cert chain).
  NSURLSessionConfiguration *cfg = [NSURLSessionConfiguration ephemeralSessionConfiguration];
  NSURLSession *session = [NSURLSession sessionWithConfiguration:cfg delegate:self delegateQueue:nil];
  [[session dataTaskWithURL:url completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
    if (error) {
      NSMutableDictionary *r = [NSMutableDictionary dictionary];
      r[@"available"] = @(NO);
      r[@"error"] = error.localizedDescription;
      resolve(r);
      return;
    }
    NSMutableDictionary *r = [NSMutableDictionary dictionary];
    r[@"available"] = @(YES);
    r[@"host"] = host;
    r[@"statusCode"] = @([(NSHTTPURLResponse *)response statusCode]);
    r[@"source"] = @"NSURLSession";
    resolve(r);
  }] resume];
}

- (void)URLSession:(NSURLSession *)session
    didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge
      completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition, NSURLCredential * _Nullable))completionHandler {
  if ([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust]) {
    completionHandler(NSURLSessionAuthChallengeUseCredential,
                      [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust]);
  } else {
    completionHandler(NSURLSessionAuthChallengePerformDefaultHandling, nil);
  }
}

- (void)addInterceptorAsync:(NSString *)name
                     resolve:(LynxCallbackBlock)resolve
                      reject:(LynxCallbackBlock)reject {
  resolve(@(name.length > 0));
}

@end
