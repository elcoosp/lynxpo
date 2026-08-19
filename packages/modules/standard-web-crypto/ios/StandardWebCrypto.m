// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <LynxModule/LynxModule.h>
#import <CommonCrypto/CommonCrypto.h>
#import <Security/Security.h>

@interface StandardWebCrypto () <LynxModule>
@end

@implementation StandardWebCrypto

+ (NSString *)name {
  return @"StandardWebCrypto";
}

- (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync" : @"isAvailableAsync:",
    @"randomBytesAsync" : @"randomBytesAsync:",
    @"digestAsync" : @"digestAsync:",
  };
}

- (BOOL)isAvailableAsync:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  resolve(@(YES));
  return YES;
}

- (NSString *)randomBytesAsync:(NSString *)length resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  NSInteger n = [length integerValue];
  if (n <= 0) {
    resolve(@"");
    return YES;
  }
  uint8_t bytes[n];
  SecRandomCopyBytes(kSecRandomDefault, n, bytes);
  NSMutableString *hex = [NSMutableString stringWithCapacity:n * 2];
  for (NSInteger i = 0; i < n; i++) {
    [hex appendFormat:@"%02x", bytes[i]];
  }
  resolve(hex);
  return YES;
}

- (NSString *)digestAsync:(NSString *)algorithm data:(NSString *)data resolve:(LynxCallbackBlock)resolve reject:(LynxCallbackBlock)reject {
  if (data == nil) {
    resolve(@"");
    return YES;
  }
  CCHashAlgorithm ccAlg = kCCHmacAlgSHA256;
  NSUInteger digestLen = CC_SHA256_DIGEST_LENGTH;
  NSString *a = [algorithm uppercaseString];
  if ([a containsString:@"SHA-1"] || [a isEqualToString:@"SHA1"]) {
    ccAlg = kCCHmacAlgSHA1; digestLen = CC_SHA1_DIGEST_LENGTH;
  } else if ([a containsString:@"SHA-384"]) {
    ccAlg = kCCHmacAlgSHA384; digestLen = CC_SHA384_DIGEST_LENGTH;
  } else if ([a containsString:@"SHA-512"]) {
    ccAlg = kCCHmacAlgSHA512; digestLen = CC_SHA512_DIGEST_LENGTH;
  } else if ([a containsString:@"MD5"]) {
    ccAlg = kCCHmacAlgMD5; digestLen = CC_MD5_DIGEST_LENGTH;
  }
  const char *cstr = [data UTF8String];
  NSData *input = [NSData dataWithBytes:cstr length:strlen(cstr)];
  uint8_t out[digestLen];
  switch (ccAlg) {
    case kCCHmacAlgSHA1: CC_SHA1(input.bytes, (CC_LONG)input.length, out); break;
    case kCCHmacAlgSHA384: CC_SHA384(input.bytes, (CC_LONG)input.length, out); break;
    case kCCHmacAlgSHA512: CC_SHA512(input.bytes, (CC_LONG)input.length, out); break;
    case kCCHmacAlgMD5: CC_MD5(input.bytes, (CC_LONG)input.length, out); break;
    default: CC_SHA256(input.bytes, (CC_LONG)input.length, out); break;
  }
  NSMutableString *hex = [NSMutableString stringWithCapacity:digestLen * 2];
  for (NSUInteger i = 0; i < digestLen; i++) {
    [hex appendFormat:@"%02x", out[i]];
  }
  resolve(hex);
  return YES;
}

@end
