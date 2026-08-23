// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Lynx/LynxUI.h>

NS_ASSUME_NONNULL_BEGIN

/// Native UI component backing the <ui-button> tag (expo-ui subset).
/// A real UIButton that dispatches a `press` event on tap.
@interface LynxpoUIButton : LynxUI <UIView *>

@end

NS_ASSUME_NONNULL_END
