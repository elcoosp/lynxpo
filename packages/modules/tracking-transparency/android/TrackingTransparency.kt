package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-tracking-transparency`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-tracking-transparency` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `TrackingTransparency` (registered via nmi).
 */
class TrackingTransparency(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getAuthorizationStatus(): String {
    // ported from expo-tracking-transparency; runtime impl in explorer modules/TrackingTransparency.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun requestAuthorization(): String {
    // ported from expo-tracking-transparency; runtime impl in explorer modules/TrackingTransparency.java
    throw NotImplementedError()
  }

}
