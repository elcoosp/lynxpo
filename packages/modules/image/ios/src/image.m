// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Image.h"
#import <Foundation/Foundation.h>

@implementation Image

- (double)getCacheSize {
  return 0.0;
}

- (void)clearCache {
}

- (BOOL)prefetch:(NSString *)url {
  (void)url;
  return NO;
}

- (BOOL)isImageLoading:(NSString *)uri {
  (void)uri;
  return NO;
}

- (void)cancelLoading:(NSString *)uri {
  (void)uri;
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"cancelLoading" : NSStringFromSelector(@selector(cancelLoading)),
    @"clearCache" : NSStringFromSelector(@selector(clearCache)),
    @"getCacheSize" : NSStringFromSelector(@selector(getCacheSize)),
    @"isImageLoading" : NSStringFromSelector(@selector(isImageLoading)),
    @"prefetch" : NSStringFromSelector(@selector(prefetch)),
  };
}
@end
