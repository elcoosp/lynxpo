// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "SecureStoreModule.h"

@implementation SecureStoreModule



#pragma mark - Keychain helpers

- (NSMutableDictionary *)queryFor:(NSString *)key {
  NSData *keyData = [key dataUsingEncoding:NSUTF8StringEncoding];
  return [@{
    (__bridge id)kSecClass : (__bridge id)kSecClassGenericPassword,
    (__bridge id)kSecAttrAccount : keyData,
    (__bridge id)kSecAttrService : @"com.lynxpo.securestore",
  } mutableCopy];
}

#pragma mark - Sync API

- (BOOL)isAvailable {
  // Keychain is always available on iOS.
  return @YES;
}

#pragma mark - Async API (LynxCallbackBlock resolve:reject:)

- (id)setItemAsync:(NSString *)key
               value:(NSString *)value {
  @try {
    if (key.length == 0 || value == nil) {
      return nil;
    }
    NSMutableDictionary *query = [self queryFor:key];
    // Remove any existing item first.
    SecItemDelete((__bridge CFDictionaryRef)query);
    NSData *valueData = [value dataUsingEncoding:NSUTF8StringEncoding];
    query[(__bridge id)kSecValueData] = valueData;
    query[(__bridge id)kSecAttrAccessible] =
        (__bridge id)kSecAttrAccessibleAfterFirstUnlock;
    OSStatus status = SecItemAdd((__bridge CFDictionaryRef)query, NULL);
    if (status == errSecSuccess) {
      return nil;
    } else {
      return nil;
    }
  } @catch (NSException *e) {
    return nil;
  }
}

- (id)getItemAsync:(NSString *)key {
  @try {
    if (key.length == 0) {
      return nil;
    }
    NSMutableDictionary *query = [self queryFor:key];
    query[(__bridge id)kSecReturnData] = @YES;
    query[(__bridge id)kSecMatchLimit] = (__bridge id)kSecMatchLimitOne;
    CFTypeRef result = NULL;
    OSStatus status =
        SecItemCopyMatching((__bridge CFDictionaryRef)query, &result);
    if (status == errSecSuccess && result != NULL) {
      NSData *valueData = (__bridge_transfer NSData *)result;
      NSString *value =
          [[NSString alloc] initWithData:valueData
                                encoding:NSUTF8StringEncoding];
      return value;
    } else {
      // Expo returns null for a missing key rather than rejecting.
      return [NSNull null];
    }
  } @catch (NSException *e) {
    return nil;
  }
}

- (id)deleteItemAsync:(NSString *)key {
  @try {
    if (key.length == 0) {
      return nil;
    }
    NSMutableDictionary *query = [self queryFor:key];
    SecItemDelete((__bridge CFDictionaryRef)query);
    return nil;
  } @catch (NSException *e) {
    return nil;
  }
}

- (id)isAvailableAsync {

  @try {
    return @([self isAvailable]);
  } @catch (NSException *e) {
    return nil;
  }
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"deleteItemAsync" : NSStringFromSelector(@selector(deleteItemAsync)),
    @"getItemAsync" : NSStringFromSelector(@selector(getItemAsync)),
    @"isAvailable" : NSStringFromSelector(@selector(isAvailable)),
    @"isAvailableAsync" : NSStringFromSelector(@selector(isAvailableAsync)),
  };
}
@end
