// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import <CommonCrypto/CommonCrypto.h>
#import <Security/Security.h>
#import "StandardWebCrypto.h"

@implementation StandardWebCrypto

- (BOOL)isAvailableAsync {
  return YES;
}

- (NSString *)randomBytesAsync:(NSString *)length {
  @try {
    NSInteger n = [length integerValue];
    if (n <= 0) {
      return @"";
    }
    uint8_t bytes[n];
    SecRandomCopyBytes(kSecRandomDefault, n, bytes);
    NSMutableString *hex = [NSMutableString stringWithCapacity:n * 2];
    for (NSInteger i = 0; i < n; i++) {
      [hex appendFormat:@"%02x", bytes[i]];
    }
    return hex;
  } @catch (NSException *e) {
    return nil;
  }
}

- (NSString *)digestAsync:(NSString *)algorithm
                     data:(NSString *)data {
  @try {
    if (data == nil) {
      return @"";
    }
    NSString *a = [algorithm uppercaseString];
    NSUInteger digestLen = CC_SHA256_DIGEST_LENGTH;
    uint8_t out[CC_SHA512_DIGEST_LENGTH];
    const char *cstr = [data UTF8String];
    NSData *input = [NSData dataWithBytes:cstr length:strlen(cstr)];
    if ([a containsString:@"SHA-1"] || [a isEqualToString:@"SHA1"]) {
      digestLen = CC_SHA1_DIGEST_LENGTH;
      CC_SHA1(input.bytes, (CC_LONG)input.length, out);
    } else if ([a containsString:@"SHA-384"]) {
      digestLen = CC_SHA384_DIGEST_LENGTH;
      CC_SHA384(input.bytes, (CC_LONG)input.length, out);
    } else if ([a containsString:@"SHA-512"]) {
      digestLen = CC_SHA512_DIGEST_LENGTH;
      CC_SHA512(input.bytes, (CC_LONG)input.length, out);
    } else if ([a containsString:@"MD5"]) {
      digestLen = CC_MD5_DIGEST_LENGTH;
      CC_MD5(input.bytes, (CC_LONG)input.length, out);
    } else {
      digestLen = CC_SHA256_DIGEST_LENGTH;
      CC_SHA256(input.bytes, (CC_LONG)input.length, out);
    }
    NSMutableString *hex = [NSMutableString stringWithCapacity:digestLen * 2];
    for (NSUInteger i = 0; i < digestLen; i++) {
      [hex appendFormat:@"%02x", out[i]];
    }
    return hex;
  } @catch (NSException *e) {
    return nil;
  }
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"isAvailableAsync" : NSStringFromSelector(@selector(isAvailableAsync)),
    @"randomBytesAsync" : NSStringFromSelector(@selector(randomBytesAsync)),
  };
}
@end
