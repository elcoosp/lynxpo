// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <LynxModule/LynxModule.h>
#import <UIKit/UIKit.h>

@interface Asset () <LynxModule>
@end

@implementation Asset

+ (NSString *)name {
  return @"Asset";
}

- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync" : @"isAvailableAsync:",
    @"assetInfoAsync" : @"assetInfoAsync:",
    @"localUriAsync" : @"localUriAsync:",
  };
}

- (BOOL)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@(YES));
  return YES;
}

- (NSDictionary *)assetInfoAsync:(NSString *)uri resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  if (uri == nil || uri.length == 0) {
    result[@"exists"] = @(NO);
    result[@"size"] = @(0);
    result[@"name"] = @"";
    result[@"localUri"] = @"";
    resolve(result);
    return YES;
  }
  NSString *path = uri;
  NSRange scheme = [uri rangeOfString:@"://"];
  if (scheme.location != NSNotFound) {
    path = [uri substringFromIndex:scheme.location + 3];
  }
  NSFileManager *fm = [NSFileManager defaultManager];
  NSString *candidate = path;
  if (![fm fileExistsAtPath:candidate]) {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    if (paths.count > 0) {
      candidate = [paths[0] stringByAppendingPathComponent:path];
    }
  }
  if ([fm fileExistsAtPath:candidate]) {
    NSDictionary *attrs = [fm attributesOfItemAtPath:candidate error:nil];
    result[@"exists"] = @(YES);
    result[@"size"] = attrs[NSFileSize] ?: @(0);
    result[@"name"] = [candidate lastPathComponent];
    result[@"localUri"] = [@"file://" stringByAppendingString:candidate];
    result[@"source"] = @"filesystem";
  } else {
    result[@"exists"] = @(NO);
    result[@"size"] = @(0);
    result[@"name"] = [path lastPathComponent];
    result[@"localUri"] = @"";
    result[@"source"] = @"unknown";
  }
  resolve(result);
  return YES;
}

- (NSString *)localUriAsync:(NSString *)uri resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  NSRange scheme = [uri rangeOfString:@"://"];
  NSString *path = (scheme.location != NSNotFound) ? [uri substringFromIndex:scheme.location + 3] : uri;
  NSFileManager *fm = [NSFileManager defaultManager];
  NSString *candidate = path;
  if (![fm fileExistsAtPath:candidate]) {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    if (paths.count > 0) {
      candidate = [paths[0] stringByAppendingPathComponent:path];
    }
  }
  if ([fm fileExistsAtPath:candidate]) {
    resolve([@"file://" stringByAppendingString:candidate]);
  } else {
    resolve(@(0));
  }
  return YES;
}

@end
