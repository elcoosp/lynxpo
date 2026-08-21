// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "MailComposerModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `MailComposerModule`. Exposes device info to JS via
/// `NativeModules.MailComposerModule`, faithfully porting Expo's native method surface.
@LynxNativeModule("MailComposerModule")
@interface MailComposerModule : NSObject <MailComposerModuleSpec>

- (BOOL)isAvailable;
- (id)getClients;
- (void)compose:(NSString *)subject body:(NSString *)body recipients:(NSArray<NSString *> *)recipients;
@end

NS_ASSUME_NONNULL_END
