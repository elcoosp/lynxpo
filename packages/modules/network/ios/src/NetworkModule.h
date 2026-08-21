// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "NetworkModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `NetworkModule`. Exposes device info to JS via
/// `NativeModules.NetworkModule`, faithfully porting Expo's native method surface.
@LynxNativeModule("NetworkModule")
@interface NetworkModule : NSObject <NetworkModuleSpec>

- (NSString *)getIpAddress;
- (id)getNetworkState;
@end

NS_ASSUME_NONNULL_END
