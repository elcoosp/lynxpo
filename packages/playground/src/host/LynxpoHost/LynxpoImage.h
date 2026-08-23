// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Lynx/LynxUI.h>

NS_ASSUME_NONNULL_BEGIN

/// Native UI component backing the <image> tag (ported from expo-image).
/// Renders a real UIImage (base64 / remote / system-symbol fallback).
@interface LynxpoImage : LynxUI <UIView *>

@end

NS_ASSUME_NONNULL_END
