// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Linking.h"
#import <Foundation/Foundation.h>

@implementation Linking

- (NSString *)getInitialURL {
  return @"";
}

- (BOOL)canOpenURL:(NSString *)url {
  (void)url;
  return NO;
}

- (void)openURL:(NSString *)url {
  (void)url;
}

@end
