// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "SecureStoreModule.h"

@implementation SecureStoreModule

+ (NSString *)name {
  return @"SecureStoreModule";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailable" : NSStringFromSelector(@selector(isAvailable)),
    @"getItemAsync" : NSStringFromSelector(@selector(getItemAsync:resolve:reject:)),
    @"setItemAsync" : NSStringFromSelector(@selector(setItemAsync:value:resolve:reject:)),
    @"deleteItemAsync" : NSStringFromSelector(@selector(deleteItemAsync:resolve:reject:)),
  };
}

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

- (NSNumber *)isAvailable {
  // Keychain is always available on iOS.
  return @YES;
}

#pragma mark - Async API (LynxCallbackBlock resolve:reject:)

- (void)setItemAsync:(NSString *)key
               value:(NSString *)value
             resolve:(LynxCallbackBlock)resolve
              reject:(LynxCallbackBlock)reject {
  @try {
    if (key.length == 0 || value == nil) {
      reject([NSString stringWithFormat:@"ERR_SECURE_STORE: key and value are required"]);
      return;
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
      resolve(nil);
    } else {
      reject([NSString stringWithFormat:@"ERR_SECURE_STORE: SecItemAdd failed: %d", (int)status]);
    }
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_SECURE_STORE: %@", e.reason]);
  }
}

- (void)getItemAsync:(NSString *)key
             resolve:(LynxCallbackBlock)resolve
              reject:(LynxCallbackBlock)reject {
  @try {
    if (key.length == 0) {
      reject([NSString stringWithFormat:@"ERR_SECURE_STORE: key is required"]);
      return;
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
      resolve(value);
    } else {
      // Expo returns null for a missing key rather than rejecting.
      resolve([NSNull null]);
    }
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_SECURE_STORE: %@", e.reason]);
  }
}

- (void)deleteItemAsync:(NSString *)key
                 resolve:(LynxCallbackBlock)resolve
                  reject:(LynxCallbackBlock)reject {
  @try {
    if (key.length == 0) {
      reject([NSString stringWithFormat:@"ERR_SECURE_STORE: key is required"]);
      return;
    }
    NSMutableDictionary *query = [self queryFor:key];
    SecItemDelete((__bridge CFDictionaryRef)query);
    resolve(nil);
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_SECURE_STORE: %@", e.reason]);
  }
}

- (void)isAvailableAsync:(LynxCallbackBlock)resolve
                  reject:(LynxCallbackBlock)reject {
  @try {
    resolve([self isAvailable]);
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_SECURE_STORE: %@", e.reason]);
  }
}

@end
