// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "CryptoModule.h"
#import <CommonCrypto/CommonCrypto.h>
#import <CommonCrypto/CommonRandom.h>

@implementation CryptoModule

+ (NSString *)name {
  return @"CryptoModule";
}

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"digestString" : NSStringFromSelector(@selector(digestString:data:encoding:)),
    @"getRandomBytes" : NSStringFromSelector(@selector(getRandomBytes:)),
    @"randomUUID" : NSStringFromSelector(@selector(randomUUID)),
  };
}

#pragma mark - Helpers

- (NSData *)digestDataFor:(NSString *)algorithm data:(NSData *)input {
  // Map to CommonCrypto digest lengths/selectors.
  if ([algorithm isEqualToString:@"SHA1"]) {
    uint8_t buf[CC_SHA1_DIGEST_LENGTH];
    CC_SHA1(input.bytes, (CC_LONG)input.length, buf);
    return [NSData dataWithBytes:buf length:CC_SHA1_DIGEST_LENGTH];
  } else if ([algorithm isEqualToString:@"SHA256"]) {
    uint8_t buf[CC_SHA256_DIGEST_LENGTH];
    CC_SHA256(input.bytes, (CC_LONG)input.length, buf);
    return [NSData dataWithBytes:buf length:CC_SHA256_DIGEST_LENGTH];
  } else if ([algorithm isEqualToString:@"SHA384"]) {
    uint8_t buf[CC_SHA384_DIGEST_LENGTH];
    CC_SHA384(input.bytes, (CC_LONG)input.length, buf);
    return [NSData dataWithBytes:buf length:CC_SHA384_DIGEST_LENGTH];
  } else if ([algorithm isEqualToString:@"SHA512"]) {
    uint8_t buf[CC_SHA512_DIGEST_LENGTH];
    CC_SHA512(input.bytes, (CC_LONG)input.length, buf);
    return [NSData dataWithBytes:buf length:CC_SHA512_DIGEST_LENGTH];
  } else if ([algorithm isEqualToString:@"MD5"]) {
    uint8_t buf[CC_MD5_DIGEST_LENGTH];
    CC_MD5(input.bytes, (CC_LONG)input.length, buf);
    return [NSData dataWithBytes:buf length:CC_MD5_DIGEST_LENGTH];
  }
  return nil;
}

+ (NSString *)hexString:(NSData *)data {
  const unsigned char *bytes = (const unsigned char *)data.bytes;
  NSMutableString *out = [NSMutableString stringWithCapacity:data.length * 2];
  for (NSUInteger i = 0; i < data.length; i++) {
    [out appendFormat:@"%02x", bytes[i]];
  }
  return [out copy];
}

+ (NSString *)base64String:(NSData *)data {
  return [data base64EncodedStringWithOptions:0];
}

#pragma mark - Sync API

- (NSString *)digestString:(NSString *)algorithm data:(NSString *)data encoding:(NSString *)encoding {
  NSData *input = [data dataUsingEncoding:NSUTF8StringEncoding];
  NSData *digest = [self digestDataFor:algorithm data:input];
  if (!digest) return nil;
  if ([encoding isEqualToString:@"BASE64"]) {
    return [CryptoModule base64String:digest];
  }
  return [CryptoModule hexString:digest];  // default HEX
}

- (NSString *)getRandomBytes:(NSNumber *)byteCount {
  NSInteger count = [byteCount integerValue];
  if (count <= 0 || count > 1024) return nil;
  NSMutableData *bytes = [NSMutableData dataWithLength:count];
  if (SecRandomCopyBytes(kSecRandomDefault, count, bytes.mutableBytes) != errSecSuccess) {
    return nil;
  }
  return [CryptoModule base64String:bytes];
}

- (NSString *)randomUUID {
  return [[NSUUID UUID] UUIDString];
}

#pragma mark - Async API (LynxCallbackBlock resolve:reject:)

- (void)digestStringAsync:(NSString *)algorithm
                     data:(NSString *)data
                 encoding:(NSString *)encoding
                  resolve:(LynxCallbackBlock)resolve
                   reject:(LynxCallbackBlock)reject {
  @try {
    NSString *result = [self digestString:algorithm data:data encoding:encoding];
    if (result) {
      resolve(result);
    } else {
      reject([NSString stringWithFormat:@"ERR_CRYPTO: %@", @"Unsupported algorithm"]);
    }
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_CRYPTO: %@", e.reason]);
  }
}

- (void)getRandomBytesAsync:(NSNumber *)byteCount
                    resolve:(LynxCallbackBlock)resolve
                     reject:(LynxCallbackBlock)reject {
  @try {
    NSString *result = [self getRandomBytes:byteCount];
    if (result) {
      resolve(result);
    } else {
      reject([NSString stringWithFormat:@"ERR_CRYPTO: %@", @"byteCount must be in range 1..1024"]);
    }
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_CRYPTO: %@", e.reason]);
  }
}

@end
