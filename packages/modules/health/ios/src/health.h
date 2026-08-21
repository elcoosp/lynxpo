// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "HealthSpec.h"

NS_ASSUME_NONNULL_BEGIN
@LynxNativeModule("Health")
@interface Health : NSObject <HealthSpec>
@end
NS_ASSUME_NONNULL_END
