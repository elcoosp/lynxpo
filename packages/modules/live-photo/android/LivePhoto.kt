// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules

import android.content.Context
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android counterpart of LivePhoto (expo-live-photo). Live Photos are an
 * iOS-only (PHLivePhoto) concept; the Android twin reports availability
 * honestly. The real implementation lives in LivePhoto.m.
 */
class LivePhoto(context: Context) : LynxModule(context) {

  @LynxMethod
  fun isAvailableAsync(): Boolean = false

  @LynxMethod
  fun isLivePhotoAsync(path: String): Boolean = false

  @LynxMethod
  fun saveLivePhotoAsync(video: String, photo: String): Boolean = false
}
