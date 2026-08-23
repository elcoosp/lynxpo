package com.lynxpo.quickactions

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-quick-actions`. The ktts plugin reads
 * this file and generates `src/index.ts`. Method names mirror Expo's
 * `expo-quick-actions` native module surface. Runtime twin lives in the Lynx
 * Explorer.
 */
class QuickActionsModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getShortcutItemsAsync(): Map<String, Any> { throw NotImplementedError() }

  @LynxMethod
  fun setShortcutItemsAsync(items: String): Unit { throw NotImplementedError() }

  @LynxMethod
  fun clearShortcutItemsAsync(): Unit { throw NotImplementedError() }

  @LynxMethod
  fun initialActionAsync(): Map<String, Any>? { throw NotImplementedError() }
}
