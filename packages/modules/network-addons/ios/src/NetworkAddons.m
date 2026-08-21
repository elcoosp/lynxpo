// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "NetworkAddons.h"

@implementation NetworkAddons

- (BOOL)isAvailableAsync {
  return YES;
}

- (id)certificateInfoAsync:(NSString *)host {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if (host.length == 0) {
    result[@"available"] = @(NO);
    result[@"error"] = @"missing host";
    return result;
  }
  NSString *target = [host hasPrefix:@"http"] ? host : [@"https://" stringByAppendingString:host];
  NSURL *url = [NSURL URLWithString:target];
  if (url == nil) {
    result[@"available"] = @(NO);
    result[@"error"] = @"invalid url";
    return result;
  }
  // LynxPo showcase: synchronous placeholder; live trust chain not surfaced here.
  result[@"available"] = @(YES);
  result[@"host"] = host;
  result[@"source"] = @"NSURLSession";
  return result;
}

- (BOOL)addInterceptorAsync:(NSString *)name {
  return (name.length > 0);
}

@end
