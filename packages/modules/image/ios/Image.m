// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Image.h"
#import <Foundation/Foundation.h>

@implementation Image

+ (NSString *)name {
 return @"Image";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"getCacheSize" : NSStringFromSelector(@selector(getCacheSize)),
  @"clearCache" : NSStringFromSelector(@selector(clearCache)),
  @"prefetch" : NSStringFromSelector(@selector(prefetchWithUrl:(NSString *)url)),
  @"isImageLoading" : NSStringFromSelector(@selector(isImageLoadingWithUri:(NSString *)uri)),
  @"cancelLoading" : NSStringFromSelector(@selector(cancelLoadingWithUri:(NSString *)uri)),
 };
}

- (double)getCacheSize {
 return 0.0;
}

- (void)clearCache {
}

- (BOOL)prefetchWithUrl:(NSString *)url {
 return YES;
}

- (BOOL)isImageLoadingWithUri:(NSString *)uri {
 return NO;
}

- (void)cancelLoadingWithUri:(NSString *)uri {
}

@end
