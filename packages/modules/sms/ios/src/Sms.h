// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "SmsSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `Sms`. Exposes native functionality to JS via
/// `NativeModules.Sms`, faithfully porting Expo's `expo-sms` native method surface.
@LynxNativeModule("Sms")
@interface Sms : NSObject <SmsSpec>

- (BOOL)isAvailable;
- (void)sendSMS:(id)addresses message:(NSString *)message;

@end

NS_ASSUME_NONNULL_END
