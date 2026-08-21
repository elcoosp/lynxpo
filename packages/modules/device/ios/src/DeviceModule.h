// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import "DeviceModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

@LynxNativeModule("DeviceModule")
@interface DeviceModule : NSObject <DeviceModuleSpec>

@end

NS_ASSUME_NONNULL_END
