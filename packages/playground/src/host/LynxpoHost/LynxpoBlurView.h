// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Lynx/LynxUI.h>

NS_ASSUME_NONNULL_BEGIN

/// Native UI component backing the <blur-view> tag (ported from expo-blur).
/// Renders a real UIVisualEffectView backdrop and keeps it behind any child
/// content, matching expo-blur's <BlurView>{children}</BlurView> shape.
@interface LynxpoBlurView : LynxUI <UIView *>

@end

NS_ASSUME_NONNULL_END
