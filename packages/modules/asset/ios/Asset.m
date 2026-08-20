// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "Asset.h"

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

- (void)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@(YES));
}

- (NSString *)stripScheme:(NSString *)uri {
  if (uri == nil) return @"";
  NSRange r = [uri rangeOfString:@"://"];
  return r.location != NSNotFound ? [uri substringFromIndex:r.location + 3] : uri;
}

- (void)assetInfoAsync:(NSString *)uri
               resolve:(LynxCallbackBlock)resolve
                reject:(LynxCallbackBlock)reject {
  NSMutableDictionary *result = [NSMutableDictionary dictionary];
  NSString *path = [self stripScheme:uri];
  NSFileManager *fm = [NSFileManager defaultManager];
  BOOL isDir = NO;
  BOOL exists = [fm fileExistsAtPath:path isDirectory:&isDir];
  if (!exists) {
    result[@"exists"] = @(NO);
    result[@"size"] = @(0);
    result[@"name"] = [path lastPathComponent];
    result[@"localUri"] = @"";
    result[@"source"] = @"unknown";
  } else {
    NSDictionary *attrs = [fm attributesOfItemAtPath:path error:nil];
    result[@"exists"] = @(YES);
    result[@"size"] = attrs[NSFileSize] ?: @(0);
    result[@"name"] = [path lastPathComponent];
    result[@"localUri"] = [@"file://" stringByAppendingString:path];
    result[@"source"] = @"filesystem";
  }
  resolve(result);
}

- (void)localUriAsync:(NSString *)uri
               resolve:(LynxCallbackBlock)resolve
                reject:(LynxCallbackBlock)reject {
  NSString *path = [self stripScheme:uri];
  NSFileManager *fm = [NSFileManager defaultManager];
  BOOL isDir = NO;
  if ([fm fileExistsAtPath:path isDirectory:&isDir]) {
    resolve([@"file://" stringByAppendingString:path]);
  } else {
    resolve(@"");
  }
}

@end
