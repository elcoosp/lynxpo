// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Foundation/Foundation.h>
#import <Lynx/LynxModule.h>
#import "FileSystemModuleSpec.h"

NS_ASSUME_NONNULL_BEGIN

/// iOS counterpart of the Android `FileSystemModule`. Exposes a scoped
/// document/file-system surface to JS via `NativeModules.FileSystemModule`,
/// faithfully porting the core of Expo's `expo-file-system` (latest) module.
/// Method names MUST match the Android `methodLookup` keys and the shared
/// `@lynxpo/mods-file-system` accessors. Paths resolve inside the app's
/// Documents directory so no permission is required.
@LynxNativeModule("FileSystemModule")
@interface FileSystemModule : NSObject <FileSystemModuleSpec>

@end

NS_ASSUME_NONNULL_END
