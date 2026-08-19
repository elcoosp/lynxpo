// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import android.content.Context

/**
 * Android counterpart of the iOS VideoThumbnails. Exposes functionality to JS via
 * NativeModules.VideoThumbnails, faithfully porting Expo's native method surface.
 */
class VideoThumbnails(context: Context) : LynxModule(context) {
  @LynxMethod
  fun getThumbnailAsync(source: String, options: String): Map<String, Any> {
    throw NotImplementedError()
  }

  @LynxMethod
  fun isAvailableAsync(): Boolean {
    throw NotImplementedError()
  }

}
