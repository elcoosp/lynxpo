// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxTemplateProvider.h>

NS_ASSUME_NONNULL_BEGIN

/// Minimal local-file template provider for the standalone LynxpoHost app.
/// Resolves a `.lynx.bundle` resource shipped inside the app bundle and
/// returns its raw data to the Lynx runtime.
@interface HostTemplateProvider : NSObject <LynxTemplateProvider>

@end

NS_ASSUME_NONNULL_END
