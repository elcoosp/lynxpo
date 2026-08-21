// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "IntentLauncherSpec.h"

NS_ASSUME_NONNULL_BEGIN
@LynxNativeModule("IntentLauncher")
@interface IntentLauncher : NSObject <IntentLauncherSpec>
@end
NS_ASSUME_NONNULL_END
