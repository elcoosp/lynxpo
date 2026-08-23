// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#import <Lynx/LynxUI.h>

NS_ASSUME_NONNULL_BEGIN

/// Native UI component backing the <mesh-gradient> tag (ported from
/// expo-mesh-gradient). Renders a real MeshGradient (iOS 18+) or a static
/// multi-stop linear fallback on older iOS.
@interface LynxpoMeshGradient : LynxUI <UIView *>

@end

NS_ASSUME_NONNULL_END
