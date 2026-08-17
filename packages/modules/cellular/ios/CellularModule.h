// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `CellularModule`. Exposes device info to JS via
/// `NativeModules.CellularModule`, faithfully porting Expo's native method surface.
@interface CellularModule : NSObject <LynxModule>

- (int)getCellularGeneration;
- (NSString *)getIsoCountryCode;
- (NSString *)getCarrierName;
- (NSString *)getMobileCountryCode;
- (NSString *)getMobileNetworkCode;
@end

NS_ASSUME_NONNULL_END
