package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-haptics`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-haptics` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `HapticsModule`
 * (registered via nmi).
 */
class HapticsModule(context: android.content.Context) : LynxModule(context) {
  
  
    @LynxMethod
  fun impactAsync(style: Int, p: Promise<Unit>) {}
  @LynxMethod
  fun notificationAsync(type: Int, p: Promise<Unit>) {}
  @LynxMethod
  fun selectionAsync(p: Promise<Unit>) {}
}
