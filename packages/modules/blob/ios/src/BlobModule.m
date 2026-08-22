// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "BlobModule.h"

@implementation BlobModule {
  // blobId -> { data, type }
  NSMutableDictionary<NSString *, NSData *> *_store;
  NSMutableDictionary<NSString *, NSString *> *_types;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _store = [NSMutableDictionary dictionary];
    _types = [NSMutableDictionary dictionary];
  }
  return self;
}

#pragma mark - Helpers

- (NSString *)nextId {
  return [[NSUUID UUID] UUIDString];
}

- (NSData *)decode:(NSString *)payload {
  // payload is a base64 string (UTF-8 text is base64-encoded by the JS facade).
  if (payload.length == 0) return [NSData data];
  return [[NSData alloc] initWithBase64EncodedString:payload
                                             options:NSDataBase64DecodingIgnoreUnknownCharacters]
             ?: [NSData data];
}

#pragma mark - Sync API

- (NSString *)create:(NSString *)payload type:(NSString *)type {
  @try {
    NSString *p = payload ?: @"";
    NSString *t = type ?: @"";
    NSData *data = [self decode:p];
    NSString *blobId = [self nextId];
    _store[blobId] = data;
    _types[blobId] = t;
    return blobId;
  } @catch (NSException *e) {
    return nil;
  }
}

- (double)size:(NSString *)blobId {
  NSData *data = _store[blobId];
  return data ? (double)data.length : 0.0;
}

- (NSString *)type:(NSString *)blobId {
  NSString *t = _types[blobId];
  return t ?: @"";
}

- (NSString *)slice:(NSString *)blobId
              start:(double)start
                end:(double)end
       contentType:(NSString *)contentType {
  @try {
    NSData *data = _store[blobId];
    if (!data) return nil;
    NSInteger len = (NSInteger)data.length;
    NSInteger s = (NSInteger)start;
    NSInteger e = (NSInteger)end;
    if (s < 0) s = 0;
    if (e > len || e < 0) e = len;
    if (s > e) s = e;
    NSRange range = NSMakeRange((NSUInteger)s, (NSUInteger)(e - s));
    NSData *sliced = [data subdataWithRange:range];
    NSString *blobId2 = [self nextId];
    _store[blobId2] = sliced;
    _types[blobId2] = contentType ?: @"";
    return blobId2;
  } @catch (NSException *e) {
    return nil;
  }
}

- (NSString *)bytes:(NSString *)blobId {
  @try {
    NSData *data = _store[blobId];
    if (!data) return nil;
    return [data base64EncodedStringWithOptions:0];
  } @catch (NSException *e) {
    return nil;
  }
}

- (NSString *)text:(NSString *)blobId {
  @try {
    NSData *data = _store[blobId];
    if (!data) return nil;
    return [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
  } @catch (NSException *e) {
    return nil;
  }
}

- (NSString *)arrayBuffer:(NSString *)blobId {
  // ArrayBuffer of a blob is its raw bytes; base64-encoded across the bridge.
  return [self bytes:blobId];
}

#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"create" : NSStringFromSelector(@selector(create:type:)),
    @"size" : NSStringFromSelector(@selector(size:)),
    @"type" : NSStringFromSelector(@selector(type:)),
    @"slice" : NSStringFromSelector(@selector(slice:start:end:contentType:)),
    @"bytes" : NSStringFromSelector(@selector(bytes:)),
    @"text" : NSStringFromSelector(@selector(text:)),
    @"arrayBuffer" : NSStringFromSelector(@selector(arrayBuffer:)),
  };
}

@end
