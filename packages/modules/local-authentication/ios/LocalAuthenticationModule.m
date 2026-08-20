// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "LocalAuthenticationModule.h"
#import <LocalAuthentication/LocalAuthentication.h>

@implementation LocalAuthenticationModule

+ (NSString *)name {
  return @"LocalAuthenticationModule";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"hasHardware" : NSStringFromSelector(@selector(hasHardware)),
    @"isEnrolled" : NSStringFromSelector(@selector(isEnrolled)),
    @"getEnrolledLevel" : NSStringFromSelector(@selector(getEnrolledLevel)),
    @"supportedAuthenticationTypes" :
        NSStringFromSelector(@selector(supportedAuthenticationTypes)),
  };
}

#pragma mark - Helpers

- (LAContext *)freshContext {
  return [[LAContext alloc] init];
}

- (BOOL)canEvaluateBiometrics:(LAContext *)context {
  NSError *error = nil;
  return [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error];
}

#pragma mark - Sync API

- (NSNumber *)hasHardware {
  LAContext *context = [self freshContext];
  NSError *error = nil;
  // Hardware is present if the policy is evaluable for any reason other than
  // "not enrolled" / "user cancel" — i.e. biometry is physically available.
  BOOL evaluable = [context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics
                                         error:&error];
  if (evaluable) {
    return @YES;
  }
  return @(error.code != LAErrorBiometryNotAvailable &&
           error.code != LAErrorBiometryNotEnrolled &&
           error.code != LAErrorPasscodeNotSet);
}

- (NSNumber *)isEnrolled {
  LAContext *context = [self freshContext];
  NSError *error = nil;
  return @([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error]);
}

- (NSString *)getEnrolledLevel {
  LAContext *context = [self freshContext];
  NSError *error = nil;
  if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error]) {
    return @"STRONG";
  }
  return @"NONE";
}

- (NSString *)supportedAuthenticationTypes {
  LAContext *context = [self freshContext];
  // iOS reports a single biometry type via biometryType (iOS 11+).
  if (@available(iOS 11.0, *)) {
    if (context.biometryType == LABiometryTypeTouchID) {
      return @"FINGERPRINT";
    } else if (context.biometryType == LABiometryTypeFaceID) {
      return @"FACE";
    } else if (context.biometryType == LABiometryTypeNone) {
      return @"";
    }
  }
  return @"";
}

#pragma mark - Async API (LynxCallbackBlock resolve:reject:)

- (void)hasHardwareAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try {
    resolve([self hasHardware]);
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_LA: %@", e.reason]);
  }
}

- (void)isEnrolledAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try {
    resolve([self isEnrolled]);
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_LA: %@", e.reason]);
  }
}

- (void)getEnrolledLevelAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  @try {
    resolve([self getEnrolledLevel]);
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_LA: %@", e.reason]);
  }
}

- (void)supportedAuthenticationTypesAsync:(LynxCallbackBlock)resolve
                                    reject:(LynxCallbackBlock)reject {
  @try {
    resolve([self supportedAuthenticationTypes]);
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_LA: %@", e.reason]);
  }
}

- (void)authenticateAsync:(NSString *)prompt
                  resolve:(LynxCallbackBlock)resolve
                   reject:(LynxCallbackBlock)reject {
  LAContext *context = [self freshContext];
  NSString *reason = (prompt.length > 0) ? prompt : @"Authenticate";
  [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics
            localizedReason:reason
                      reply:^(BOOL success, NSError *authError) {
                        if (success) {
                          resolve(@{@"success" : @YES});
                        } else {
                          resolve(@{
                            @"success" : @NO,
                            @"error" : authError.localizedDescription ?: @"Authentication failed",
                            @"warning" : @""
                          });
                        }
                      }];
}

@end
