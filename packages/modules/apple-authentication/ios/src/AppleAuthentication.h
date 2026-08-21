// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "AppleAuthenticationSpec.h"

@LynxNativeModule("AppleAuthentication")
@interface AppleAuthentication : NSObject <AppleAuthenticationSpec>

@property (nonatomic, copy) LynxCallbackBlock pendingResolve;
@property (nonatomic, copy) LynxCallbackBlock pendingReject;

@end
