package com.lynxpo.linkpreview

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for `@lynxpo/mods-link-preview`. The ktts plugin reads
 * this file and generates `src/index.ts`. Method names mirror Expo's
 * `expo-link-preview` native module surface. Runtime twin lives in the Lynx
 * Explorer.
 */
class LinkPreviewModule(context: android.content.Context) : LynxModule(context) {
  @LynxMethod
  fun generateLinkPreviewAsync(url: String): Map<String, Any> { throw NotImplementedError() }
}
