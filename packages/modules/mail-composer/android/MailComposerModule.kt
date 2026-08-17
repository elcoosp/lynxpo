package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-mail-composer`. The ktts plugin reads this file and
 * generates `src/index.ts`. Method names mirror Expo's `expo-mail-composer` (latest)
 * native module surface. The runtime twin lives in the Lynx Explorer as `MailComposerModule`
 * (registered via nmi).
 */
class MailComposerModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun isAvailable(): Boolean {
    // ported from expo-mail-composer; runtime impl in explorer modules/MailComposerModule.java
    throw NotImplementedError()
  }

  @LynxMethod
  fun getClients(): List<String> {
    // ported from expo-mail-composer; runtime impl in explorer modules/MailComposerModule.java
    throw NotImplementedError()
  }

    @LynxMethod
  fun isAvailableAsync(p: Promise<Boolean>) {}
  @LynxMethod
  fun getClientsAsync(p: Promise<List<String>>) {}
  @LynxMethod
  fun composeAsync(subject: String, body: String, recipients: List<String>, p: Promise<Unit>) {}
}
