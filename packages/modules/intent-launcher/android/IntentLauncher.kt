// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import android.content.Context

/**
 * Android counterpart of the iOS IntentLauncher. Exposes functionality to JS via
 * NativeModules.IntentLauncher, faithfully porting Expo's native method surface.
 */
class IntentLauncher(context: Context) : LynxModule(context) {
  @LynxMethod
  fun startActivity(activity: String, data: String): String {
    throw NotImplementedError()
  }

  @LynxMethod
  fun startActivityAsync(options: String): String {
    throw NotImplementedError()
  }

  @LynxMethod
  fun canOpenURL(url: String): Boolean {
    throw NotImplementedError()
  }

}
