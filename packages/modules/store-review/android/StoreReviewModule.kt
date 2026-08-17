package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-store-review`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-store-review` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `StoreReviewModule`
 * (registered via nmi).
 */
class StoreReviewModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun isAvailable(): Boolean {
    // ported from expo-store-review; runtime impl in explorer modules/StoreReviewModule.java
    throw NotImplementedError()
  }

    @LynxMethod
  fun isAvailableAsync(p: Promise<Boolean>) {}
  @LynxMethod
  fun requestReviewAsync(p: Promise<Unit>) {}
}
