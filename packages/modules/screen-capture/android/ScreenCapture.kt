// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import android.content.Context

/**
 * Android counterpart of the iOS ScreenCapture. Exposes functionality to JS via
 * NativeModules.ScreenCapture, faithfully porting Expo's native method surface
 * (expo-screen-capture). Method names MUST match the iOS methodLookup keys so the
 * shared @lynxpo/mods-screen-capture accessors resolve on both platforms.
 */
class ScreenCapture(context: Context) : LynxModule(context) {

  @LynxMethod
  fun isAvailableAsync(): Boolean {
    throw NotImplementedError()
  }

  @LynxMethod
  fun preventScreenCapture(): Boolean {
    throw NotImplementedError()
  }

  @LynxMethod
  fun allowScreenCapture(): Boolean {
    throw NotImplementedError()
  }

  @LynxMethod
  fun permissionsAsync(): Map<String, Any> {
    throw NotImplementedError()
  }

  @LynxMethod
  fun requestPermissionsAsync(): Map<String, Any> {
    throw NotImplementedError()
  }

}
