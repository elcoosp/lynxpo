// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "FileSystemModule.h"

@implementation FileSystemModule

+ (NSString *)name {
  return @"FileSystemModule";
}

// NOTE: Lynx iOS SDK 1.4.0 emits LynxError 90108 ("Use deprecated native
// promise") for the resolve:reject: async convention — this is a WARNING, not
// a hard failure, and the promise still resolves with real data. Using the
// `:reject:`-only lookup form instead makes buildLookupMap skip the entry
// (instanceMethodSignatureForSelector returns nil → "cannot be found"), so the
// full real selector MUST be listed here. This matches the repo-wide async
// module pattern (SecureStore/Network/Battery async all use resolve:reject:).
+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"writeAsStringAsync" :
        NSStringFromSelector(@selector(writeAsStringAsync:
                                                  contents:
                                                   resolve:
                                                    reject:)),
    @"readAsStringAsync" :
        NSStringFromSelector(@selector(readAsStringAsync:
                                                  resolve:
                                                   reject:)),
    @"getInfoAsync" : NSStringFromSelector(@selector(getInfoAsync:
                                                        resolve:
                                                         reject:)),
    @"makeDirectoryAsync" :
        NSStringFromSelector(@selector(makeDirectoryAsync:
                                                  resolve:
                                                   reject:)),
    @"deleteAsync" : NSStringFromSelector(@selector(deleteAsync:
                                                    resolve:
                                                     reject:)),
  };
}

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

- (void)writeAsStringAsync:(NSString *)path
                  contents:(NSString *)contents
                   resolve:(LynxCallbackBlock)resolve
                    reject:(LynxCallbackBlock)reject {
  @try {
    if (path.length == 0 || contents == nil) {
      reject([NSString stringWithFormat:
                             @"ERR_FILE_SYSTEM: path and contents are required"]);
      return;
    }
    NSString *full = [self resolvePath:path];
    if (full == nil) {
      reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: invalid path"]);
      return;
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
      resolve(nil);
    } else {
      reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: write failed: %@",
                                         err.localizedDescription]);
    }
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: %@", e.reason]);
  }
}

- (void)readAsStringAsync:(NSString *)path
                   resolve:(LynxCallbackBlock)resolve
                    reject:(LynxCallbackBlock)reject {
  @try {
    if (path.length == 0) {
      reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: path is required"]);
      return;
    }
    NSString *full = [self resolvePath:path];
    if (full == nil) {
      reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: invalid path"]);
      return;
    }
    if (![[NSFileManager defaultManager] fileExistsAtPath:full]) {
      reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: ENOENT: %@", path]);
      return;
    }
    NSError *err = nil;
    NSString *contents =
        [NSString stringWithContentsOfFile:full
                                  encoding:NSUTF8StringEncoding
                                     error:&err];
    if (contents && !err) {
      resolve(contents);
    } else {
      reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: read failed: %@",
                                         err.localizedDescription]);
    }
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: %@", e.reason]);
  }
}

- (void)getInfoAsync:(NSString *)path
             resolve:(LynxCallbackBlock)resolve
              reject:(LynxCallbackBlock)reject {
  @try {
    if (path.length == 0) {
      reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: path is required"]);
      return;
    }
    NSString *full = [self resolvePath:path];
    if (full == nil) {
      reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: invalid path"]);
      return;
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
    resolve(info);
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: %@", e.reason]);
  }
}

- (void)makeDirectoryAsync:(NSString *)path
                   resolve:(LynxCallbackBlock)resolve
                    reject:(LynxCallbackBlock)reject {
  @try {
    if (path.length == 0) {
      reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: path is required"]);
      return;
    }
    NSString *full = [self resolvePath:path];
    if (full == nil) {
      reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: invalid path"]);
      return;
    }
    NSError *err = nil;
    BOOL ok = [[NSFileManager defaultManager]
                 createDirectoryAtPath:full
            withIntermediateDirectories:YES
                             attributes:nil
                                  error:&err];
    resolve(@(ok || [NSFileManager.defaultManager fileExistsAtPath:full]));
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: %@", e.reason]);
  }
}

- (void)deleteAsync:(NSString *)path
             resolve:(LynxCallbackBlock)resolve
              reject:(LynxCallbackBlock)reject {
  @try {
    if (path.length == 0) {
      reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: path is required"]);
      return;
    }
    NSString *full = [self resolvePath:path];
    if (full == nil) {
      reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: invalid path"]);
      return;
    }
    NSFileManager *fm = [NSFileManager defaultManager];
    if (![fm fileExistsAtPath:full]) {
      resolve(nil);
      return;
    }
    NSError *err = nil;
    BOOL ok = [fm removeItemAtPath:full error:&err];
    resolve(@(ok));
  } @catch (NSException *e) {
    reject([NSString stringWithFormat:@"ERR_FILE_SYSTEM: %@", e.reason]);
  }
}

@end
