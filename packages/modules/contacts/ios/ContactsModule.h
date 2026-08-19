// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `ContactsModule`. Exposes contacts to JS via
/// `NativeModules.ContactsModule`, faithfully porting Expo's `expo-contacts` native
/// method surface.
@interface ContactsModule : NSObject <LynxModule>

- (NSDictionary<NSString *, id> *)permissionsAsync;
- (void)requestPermission;
- (NSInteger)contactCount;
- (NSInteger)containerCount;
@end

NS_ASSUME_NONNULL_END
