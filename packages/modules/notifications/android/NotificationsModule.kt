package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-notifications`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-notifications` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `NotificationsModule`
 * (registered via nmi).
 */
class NotificationsModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun permissionsAsync(): Map<String, Any> {
    // ported from expo-notifications; runtime impl in explorer modules/NotificationsModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun requestPermission(): Unit {
    // runtime impl in explorer modules/NotificationsModule.java (delegates to host activity)
    throw NotImplementedError()
  }

  @LynxMethod
  fun isDeviceRegisteredForRemoteMessages(): Boolean {
    throw NotImplementedError()
  }

  @LynxMethod
  fun badgeCountAsync(): Int {
    throw NotImplementedError()
  }

  @LynxMethod
  fun devicePushTokenAsync(): Map<String, String> {
    throw NotImplementedError()
  }
}
