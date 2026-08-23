package com.lynxpo.updates

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-updates`. The ktts plugin reads this
 * file and generates `src/index.ts`. Method names mirror Expo's `expo-updates`
 * native module surface. Runtime twin lives in the Lynx Explorer.
 */
class UpdatesModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun getNativeStateAsync(): Map<String, Any> { throw NotImplementedError() }

  @LynxMethod
  fun checkForUpdateAsync(): Map<String, Any> { throw NotImplementedError() }

  @LynxMethod
  fun fetchUpdateAsync(): Map<String, Any> { throw NotImplementedError() }

  @LynxMethod
  fun isUpdateAvailableAsync(): Boolean { throw NotImplementedError() }

  @LynxMethod
  fun reloadAsync(): Unit { throw NotImplementedError() }
}
