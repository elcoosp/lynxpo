// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import android.content.Context

/**
 * Android counterpart of the iOS BackgroundTask. Exposes functionality to JS via
 * NativeModules.BackgroundTask, faithfully porting Expo's native method surface.
 */
class BackgroundTask(context: Context) : LynxModule(context) {
  @LynxMethod
  fun isAvailableAsync(): Boolean {
    throw NotImplementedError()
  }

  @LynxMethod
  fun registerTaskAsync(taskName: String, options: String): Boolean {
    throw NotImplementedError()
  }

  @LynxMethod
  fun unregisterTaskAsync(taskName: String): Boolean {
    throw NotImplementedError()
  }

  @LynxMethod
  fun getStatusAsync(): Map<String, Any> {
    throw NotImplementedError()
  }

}
