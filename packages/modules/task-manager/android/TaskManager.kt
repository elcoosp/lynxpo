package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-task-manager`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-task-manager` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as
 * `TaskManager` (registered via nmi).
 */
class TaskManager(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun isTaskRegistered(taskName: String): Boolean {
    // ported from expo-task-manager; runtime impl in explorer modules/TaskManager.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getRegisteredTasks(): List<String> {
    // ported from expo-task-manager; runtime impl in explorer modules/TaskManager.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun unregisterTaskAsync(taskName: String): Unit {
    // ported from expo-task-manager; runtime impl in explorer modules/TaskManager.java
    throw NotImplementedError()
  }

}
