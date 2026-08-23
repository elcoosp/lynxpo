// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Lynx/LynxUI.h>

NS_ASSUME_NONNULL_BEGIN

/// Native UI component backing the <glass-effect> tag (ported from
/// expo-glass-effect). Uses UIGlassEffect where available (iOS 26), else a
/// translucent vibrancy fallback so the component always renders.
@interface LynxpoGlassEffect : LynxUI <UIView *>

@end

NS_ASSUME_NONNULL_END
