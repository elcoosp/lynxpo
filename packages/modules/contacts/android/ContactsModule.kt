package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-contacts`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-contacts` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `ContactsModule`
 * (registered via nmi).
 */
class ContactsModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun permissionsAsync(): Map<String, Any> {
    // ported from expo-contacts; runtime impl in explorer modules/ContactsModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun requestPermission(): Unit {
    // runtime impl in explorer modules/ContactsModule.java (delegates to host activity)
    throw NotImplementedError()
  }

  @LynxMethod
  fun contactCount(): Int {
    throw NotImplementedError()
  }

  @LynxMethod
  fun containerCount(): Int {
    throw NotImplementedError()
  }
}
