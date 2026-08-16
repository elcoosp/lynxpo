package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-network`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-network` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `NetworkModule`
 * (registered via nmi).
 */
class NetworkModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getIpAddress(): String? {
    // ported from expo-network; runtime impl in explorer modules/NetworkModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getNetworkState(): Map<String, Any?> {
    // ported from expo-network; runtime impl in explorer modules/NetworkModule.java
    throw NotImplementedError()
  }

}
