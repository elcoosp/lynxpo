// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Sms.h"
#import <Foundation/Foundation.h>

@implementation Sms

+ (NSString *)name {
 return @"Sms";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
 return @{
  @"isAvailable" : NSStringFromSelector(@selector(isAvailable)),
  @"sendSMS" : NSStringFromSelector(@selector(sendSMSWithAddresses:(NSArray *)addresses message:(NSString *)message)),
 };
}

- (BOOL)isAvailable {
 return YES;
}

- (void)sendSMSWithAddresses:(NSArray *)addresses message:(NSString *)message {
}

@end
