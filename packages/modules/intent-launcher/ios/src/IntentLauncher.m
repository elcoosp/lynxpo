// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import "IntentLauncher.h"
#import <Foundation/Foundation.h>

@implementation IntentLauncher

- (NSString *)startActivity:(NSString *)activity data:(NSString *)data {
  (void)activity;
  (void)data;
  return @"";
}

- (NSString *)startActivityAsync:(NSString *)options {
  (void)options;
  return @"";
}

- (BOOL)canOpenURL:(NSString *)url {
  (void)url;
  return NO;
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"canOpenURL" : NSStringFromSelector(@selector(canOpenURL)),
    @"startActivity" : NSStringFromSelector(@selector(startActivity:data:)),
    @"startActivityAsync" : NSStringFromSelector(@selector(startActivityAsync)),
  };
}
@end
