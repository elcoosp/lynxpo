// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.livephoto.generated.LivePhotoSpec;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableMap;

/**
 * Android runtime twin of LivePhoto (expo-live-photo). Live Photos are an
 * iOS-only (PHLivePhoto) concept with no Android equivalent, so the Android
 * twin reports availability honestly rather than faking results. The real
 * implementation lives in the iOS twin (LivePhoto.m).
 */
@LynxNativeModule(name = "LivePhoto")
public class LivePhoto extends LivePhotoSpec {

  public LivePhoto(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isAvailableAsync() {
    return false;
  }

  @LynxMethod
  public boolean isLivePhotoAsync(String path) {
    return false;
  }

  @LynxMethod
  public boolean saveLivePhotoAsync(String video, String photo) {
    return false;
  }
}
