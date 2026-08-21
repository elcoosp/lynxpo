// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "ApplicationModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `ApplicationModule`. Exposes app metadata to
/// JS via `NativeModules.ApplicationModule`, faithfully porting the native
/// method surface of Expo's `expo-application` (v57) module. Method names MUST
/// match the Android `@LynxMethod` names so the shared `@lynxpo/mods-application`
/// accessors resolve on both platforms.
@LynxNativeModule("ApplicationModule")
@interface ApplicationModule : NSObject <ApplicationModuleSpec>

- (id)applicationName;
- (id)applicationId;
- (id)nativeApplicationVersion;
- (id)nativeBuildVersion;
- (NSString *)getIosIdForVendor;
- (id)getInstallationTime;

@end

NS_ASSUME_NONNULL_END
