package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-sqlite`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-sqlite` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `SqliteModule`
 * (registered via nmi).
 */
class SqliteModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun openDatabase(name: String): Unit {
    // ported from expo-sqlite; runtime impl in explorer modules/SqliteModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun execSync(query: String): List<Map<String, Any>> {
    throw NotImplementedError()
  }

  @LynxMethod
  fun getAllSync(query: String): List<Map<String, Any>> {
    throw NotImplementedError()
  }
}
