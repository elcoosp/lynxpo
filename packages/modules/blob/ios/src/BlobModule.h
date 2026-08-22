// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "BlobModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `BlobModule`. Exposes a real in-memory
/// binary large-object store to JS via `NativeModules.BlobModule`, faithfully
/// porting the native surface of Expo's `expo-blob` (latest) module. Method
/// names MUST match the Android spec keys and the shared `@lynxpo/mods-blob`
/// accessors. Bytes are base64-encoded across the bridge (Lynx supported types
/// do not include raw byte arrays). The store is process-scoped, exactly like
/// Expo's native blob manager.
@interface BlobModule : NSObject <BlobModuleSpec>

@end

NS_ASSUME_NONNULL_END
