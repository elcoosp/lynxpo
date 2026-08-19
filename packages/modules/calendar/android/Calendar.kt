package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-calendar`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-calendar` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `Calendar` (registered via nmi).
 */
class Calendar(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getCalendars(): List<Map<String, Any>> {
    // ported from expo-calendar; runtime impl in explorer modules/Calendar.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getEvents(startDate: String, endDate: String): List<Map<String, Any>> {
    // ported from expo-calendar; runtime impl in explorer modules/Calendar.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun requestPermissions(): Map<String, Any> {
    // ported from expo-calendar; runtime impl in explorer modules/Calendar.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getPermissions(): Map<String, Any> {
    // ported from expo-calendar; runtime impl in explorer modules/Calendar.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun createEvent(title: String, startDate: String, endDate: String): String {
    // ported from expo-calendar; runtime impl in explorer modules/Calendar.java
    throw NotImplementedError()
  }

}
