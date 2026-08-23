// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Lynx/LynxUI.h>

NS_ASSUME_NONNULL_BEGIN

/// Native UI component backing the <video> tag (ported from expo-video).
/// Renders a real AVPlayerLayer; plays `source` when provided.
@interface LynxpoVideo : LynxUI <UIView *>

@end

NS_ASSUME_NONNULL_END
