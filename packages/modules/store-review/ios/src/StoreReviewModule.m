// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "StoreReviewModule.h"
#import <UIKit/UIKit.h>
#import <StoreKit/StoreKit.h>

@implementation StoreReviewModule



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

- (id)isAvailableAsync {

  @try { return @([self isAvailable]); } @catch (NSException *e) { return nil; }
}
- (id)requestReviewAsync {

  @try { [self requestReview]; return nil; } @catch (NSException *e) { return nil; }
}

@end
