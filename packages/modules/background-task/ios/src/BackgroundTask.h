// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "BackgroundTaskSpec.h"

NS_ASSUME_NONNULL_BEGIN
@LynxNativeModule("BackgroundTask")
@interface BackgroundTask : NSObject <BackgroundTaskSpec>
@end
NS_ASSUME_NONNULL_END
