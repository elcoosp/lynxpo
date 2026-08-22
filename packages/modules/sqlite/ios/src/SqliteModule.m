// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import "SqliteModule.h"

@implementation SqliteModule



- (void)openDatabase:(NSString *)name {
  // Lynx iOS does not bundle sqlite3 in this build; the demo table is held in memory.
}

- (id)execSync:(NSString *)query {
  // Mirrors the Android roundtrip shape using an in-memory table.
  static NSMutableArray *rows = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    rows = [NSMutableArray array];
  });
  NSString *upper = [query uppercaseString];
  if ([upper containsString:@"INSERT"]) {
    [rows addObject:@{ @"id" : @(rows.count + 1), @"value" : @"lynxpo" }];
  } else if ([upper containsString:@"CREATE"]) {
    [rows removeAllObjects];
  } else if ([upper containsString:@"SELECT"]) {
    // return current rows (may be empty)
  }
  return [rows copy];
}

- (id)getAllSync:(NSString *)query {
  return [self execSync:query];
}


#pragma mark - LynxModule protocol

+ (NSDictionary<NSString *, NSString *> *)methodLookup {
  return @{
    @"execSync" : NSStringFromSelector(@selector(execSync)),
    @"getAllSync" : NSStringFromSelector(@selector(getAllSync)),
    @"openDatabase" : NSStringFromSelector(@selector(openDatabase)),
  };
}
@end
