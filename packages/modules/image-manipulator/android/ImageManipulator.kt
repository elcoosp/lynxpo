// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import android.content.Context

/**
 * Android counterpart of the iOS ImageManipulator. Exposes functionality to JS via
 * NativeModules.ImageManipulator, faithfully porting Expo's native method surface.
 */
class ImageManipulator(context: Context) : LynxModule(context) {
  @LynxMethod
  fun manipulateAsync(uri: String, actions: String, saveOptions: String): Map<String, Any> {
    throw NotImplementedError()
  }

  @LynxMethod
  fun isAvailableAsync(uri: String): Boolean {
    throw NotImplementedError()
  }

}
