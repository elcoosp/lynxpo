// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "SqliteModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `SqliteModule`. Exposes a SQLite-style roundtrip to JS via
/// `NativeModules.SqliteModule`, faithfully porting Expo's `expo-sqlite` native
/// method surface (in-memory table mirror, since Lynx iOS does not bundle sqlite3 here).
@LynxNativeModule("SqliteModule")
@interface SqliteModule : NSObject <SqliteModuleSpec>

- (void)openDatabase:(NSString *)name;
- (id)execSync:(NSString *)query;
- (id)getAllSync:(NSString *)query;
@end

NS_ASSUME_NONNULL_END
