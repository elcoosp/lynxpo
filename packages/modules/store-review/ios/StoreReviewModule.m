// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "StoreReviewModule.h"
#import <UIKit/UIKit.h>
#import <StoreKit/StoreKit.h>

@implementation StoreReviewModule

+ (NSString *)name {
  return @"StoreReviewModule";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailable" : NSStringFromSelector(@selector(isAvailable)),
    @"requestReview" : NSStringFromSelector(@selector(requestReview)),
  };
}

- (BOOL)isAvailable {
  if (@available(iOS 10.3, *)) {
    return [SKStoreReviewController class] != nil;
  }
  return NO;
}

- (void)requestReview {
  if (@available(iOS 10.3, *)) {
    [SKStoreReviewController requestReview];
  }
}

- (void)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { resolve(@([self isAvailable])); } @catch (NSException *e) { reject(e.reason); }
}
- (void)requestReviewAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try { [self requestReview]; resolve(nil); } @catch (NSException *e) { reject(e.reason); }
}

@end
