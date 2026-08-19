package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-sms`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-sms` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `Sms` (registered via nmi).
 */
class Sms(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun isAvailable(): Boolean {
    // ported from expo-sms; runtime impl in explorer modules/Sms.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun sendSMS(addresses: List<String>, message: String): Unit {
    // ported from expo-sms; runtime impl in explorer modules/Sms.java
    throw NotImplementedError()
  }

}
