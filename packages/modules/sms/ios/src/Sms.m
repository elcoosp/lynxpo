// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "Sms.h"
#import <Foundation/Foundation.h>

@implementation Sms

- (BOOL)isAvailable {
  return NO;
}

- (void)sendSMS:(id)addresses message:(NSString *)message {
  (void)addresses;
  (void)message;
}

@end
