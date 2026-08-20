// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `lynxpo.core.modules.device.DeviceModule`.
/// Exposes device info to JS via `NativeModules.DeviceModule` so the
/// `@lynxpo/mods-device` hooks return real data on iOS (the Android-only
/// module is undefined there).
@interface DeviceModule : NSObject <LynxModule>

- (NSNumber *)isDevice;
- (NSString *)brand;
- (NSString *)manufacturer;
- (NSString *)modelName;
- (NSString *)designName;
- (NSString *)productName;
- (NSNumber *)deviceYearClass;
- (NSNumber *)totalMemory;
- (NSNumber *)deviceType;
- (NSArray<NSString *> *)supportedCpuArchitectures;
- (NSString *)osName;
- (NSString *)osVersion;
- (NSString *)osBuildId;
- (NSString *)osInternalBuildId;
- (NSString *)osBuildFingerprint;
- (NSNumber *)platformApiLevel;
- (NSString *)deviceName;

@end

NS_ASSUME_NONNULL_END
