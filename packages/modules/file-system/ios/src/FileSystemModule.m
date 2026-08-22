// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "FileSystemModule.h"

@implementation FileSystemModule



// NOTE: Lynx iOS SDK 1.4.0 emits LynxError 90108 ("Use deprecated native
// promise") for the resolve:reject: async convention — this is a WARNING, not
// a hard failure, and the promise still resolves with real data. Using the
// `:reject:`-only lookup form instead makes buildLookupMap skip the entry
// (instanceMethodSignatureForSelector returns nil → "cannot be found"), so the
// full real selector MUST be listed here. This matches the repo-wide async
// module pattern (SecureStore/Network/Battery async all use resolve:reject:).
#pragma mark - Path helpers

- (NSString *)documentsDir {
  return [NSSearchPathForDirectoriesInDomains(
      NSDocumentDirectory, NSUserDomainMask, YES) firstObject];
}

- (NSString *)resolvePath:(NSString *)path {
  if (path.length == 0) return nil;
  NSString *clean =
      [path hasPrefix:@"/"] ? [path substringFromIndex:1] : path;
  // Reject path traversal outside the sandbox.
  if ([clean containsString:@".."]) return nil;
  return [self.documentsDir stringByAppendingPathComponent:clean];
}

#pragma mark - Async API (LynxCallbackBlock resolve:reject:)

- (id)writeAsStringAsync:(NSString *)path contents:(NSString *)contents {
  @try {
    if (path.length == 0 || contents == nil) {
      return nil;
    }
    NSString *full = [self resolvePath:path];
    if (full == nil) {
      return nil;
    }
    NSError *err = nil;
    NSString *parent = [full stringByDeletingLastPathComponent];
    [[NSFileManager defaultManager] createDirectoryAtPath:parent
                               withIntermediateDirectories:YES
                                                attributes:nil
                                                     error:&err];
    BOOL ok = [contents writeToFile:full
                         atomically:YES
                           encoding:NSUTF8StringEncoding
                              error:&err];
    if (ok && !err) {
      return nil;
    } else {
      return nil;
    }
  } @catch (NSException *e) {
    return nil;
  }
}

- (id)readAsStringAsync:(NSString *)path {
  @try {
    if (path.length == 0) {
      return nil;
    }
    NSString *full = [self resolvePath:path];
    if (full == nil) {
      return nil;
    }
    if (![[NSFileManager defaultManager] fileExistsAtPath:full]) {
      return nil;
    }
    NSError *err = nil;
    NSString *contents =
        [NSString stringWithContentsOfFile:full
                                  encoding:NSUTF8StringEncoding
                                     error:&err];
    if (contents && !err) {
      return contents;
    } else {
      return nil;
    }
  } @catch (NSException *e) {
    return nil;
  }
}

- (id)getInfoAsync:(NSString *)path {
  @try {
    if (path.length == 0) {
      return nil;
    }
    NSString *full = [self resolvePath:path];
    if (full == nil) {
      return nil;
    }
    NSFileManager *fm = [NSFileManager defaultManager];
    BOOL isDir = NO;
    BOOL exists = [fm fileExistsAtPath:full isDirectory:&isDir];
    NSDictionary *attrs = exists ? [fm attributesOfItemAtPath:full error:nil]
                                  : nil;
    long long size = [attrs fileSize];
    NSDictionary *info = @{
      @"exists" : @(exists),
      @"isDirectory" : @(isDir),
      @"size" : @(size),
      @"uri" : [NSURL fileURLWithPath:full].absoluteString,
    };
    return info;
  } @catch (NSException *e) {
    return nil;
  }
}

- (id)makeDirectoryAsync:(NSString *)path {
  @try {
    if (path.length == 0) {
      return nil;
    }
    NSString *full = [self resolvePath:path];
    if (full == nil) {
      return nil;
    }
    NSError *err = nil;
    BOOL ok = [[NSFileManager defaultManager]
                 createDirectoryAtPath:full
            withIntermediateDirectories:YES
                             attributes:nil
                                  error:&err];
    return @(ok || [NSFileManager.defaultManager fileExistsAtPath:full]);
  } @catch (NSException *e) {
    return nil;
  }
}

- (id)deleteAsync:(NSString *)path {
  @try {
    if (path.length == 0) {
      return nil;
    }
    NSString *full = [self resolvePath:path];
    if (full == nil) {
      return nil;
    }
    NSFileManager *fm = [NSFileManager defaultManager];
    if (![fm fileExistsAtPath:full]) {
      return nil;
    }
    NSError *err = nil;
    BOOL ok = [fm removeItemAtPath:full error:&err];
    return @(ok);
  } @catch (NSException *e) {
    return nil;
  }
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"deleteAsync" : NSStringFromSelector(@selector(deleteAsync)),
    @"getInfoAsync" : NSStringFromSelector(@selector(getInfoAsync)),
    @"makeDirectoryAsync" : NSStringFromSelector(@selector(makeDirectoryAsync)),
    @"readAsStringAsync" : NSStringFromSelector(@selector(readAsStringAsync)),
    @"writeAsStringAsync" : NSStringFromSelector(@selector(writeAsStringAsync:contents:)),
  };
}
@end
