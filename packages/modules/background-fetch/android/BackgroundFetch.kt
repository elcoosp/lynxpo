package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-background-fetch`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-background-fetch` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `BackgroundFetch` (registered via nmi).
 */
class BackgroundFetch(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getStatus(): Map<String, Any> {
    // ported from expo-background-fetch; runtime impl in explorer modules/BackgroundFetch.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun registerTaskAsync(taskName: String): Unit {
    // ported from expo-background-fetch; runtime impl in explorer modules/BackgroundFetch.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun unregisterTaskAsync(taskName: String): Unit {
    // ported from expo-background-fetch; runtime impl in explorer modules/BackgroundFetch.java
    throw NotImplementedError()
  }

}
