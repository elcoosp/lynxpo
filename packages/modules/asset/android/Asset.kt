// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules

import android.content.Context
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import java.io.File

/**
 * Android counterpart of Asset (expo-asset). Real file/APK metadata.
 */
class Asset(context: Context) : LynxModule(context) {

  @LynxMethod
  fun isAvailableAsync(): Boolean = true

  private fun stripScheme(uri: String?): String {
    if (uri == null) return ""
    val s = uri
    val idx = s.indexOf("://")
    return if (idx >= 0) s.substring(idx + 3) else s
  }

  @LynxMethod
  fun assetInfoAsync(uri: String): Map<String, Any> {
    if (uri.isEmpty()) {
      return mapOf("exists" to false, "size" to 0, "name" to "", "localUri" to "")
    }
    val path = stripScheme(uri)
    var f = File(path)
    if (!f.exists() && context.filesDir != null) {
      f = File(context.filesDir, path)
    }
    return if (f.exists() && f.isFile) {
      mapOf(
        "exists" to true,
        "size" to f.length(),
        "name" to f.name,
        "localUri" to ("file://" + f.absolutePath),
        "source" to "filesystem",
      )
    } else {
      mapOf(
        "exists" to false,
        "size" to 0,
        "name" to File(path).name,
        "localUri" to "",
        "source" to "unknown",
      )
    }
  }

  @LynxMethod
  fun localUriAsync(uri: String): String {
    if (uri.isEmpty()) return ""
    val path = stripScheme(uri)
    var f = File(path)
    if (!f.exists() && context.filesDir != null) {
      f = File(context.filesDir, path)
    }
    return if (f.exists() && f.isFile) "file://" + f.absolutePath else ""
  }
}
