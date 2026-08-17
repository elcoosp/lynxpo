package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-keep-awake`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-keep-awake` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `KeepAwakeModule`
 * (registered via nmi).
 */
class KeepAwakeModule(context: android.content.Context) : LynxModule(context) {
  
  
  @LynxMethod
  fun isActivated(): Boolean {
    // ported from expo-keep-awake; runtime impl in explorer modules/KeepAwakeModule.java
    throw NotImplementedError()
  }
  @LynxMethod
  fun activateAsync(p: Promise<Unit>) {}
  @LynxMethod
  fun deactivateAsync(p: Promise<Unit>) {}
  @LynxMethod
  fun isActivatedAsync(p: Promise<Boolean>) {}
}
