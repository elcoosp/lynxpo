// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Lynx/LynxUI.h>

NS_ASSUME_NONNULL_BEGIN

/// Native UI component backing the <symbols> tag (ported from expo-symbols).
/// Renders a real SF Symbol via UIImage(systemName:) with weight/scale/tint.
@interface LynxpoSymbols : LynxUI <UIView *>

@end

NS_ASSUME_NONNULL_END
