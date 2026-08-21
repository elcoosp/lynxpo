// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.view.WindowManager;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.screencapture.generated.ScreenCaptureSpec;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableMap;

/**
 * Android runtime twin of ScreenCapture (expo-screen-capture). On Android, preventing
 * screen capture maps to setting {@code FLAG_SECURE} on the host window; allowing clears it.
 * The explorer host {@code LynxViewShellActivity} is an Activity, so {@code mContext} supports
 * {@code getWindow()}.
 */
@LynxNativeModule(name = "ScreenCapture")
public class ScreenCapture extends ScreenCaptureSpec {

  public ScreenCapture(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isAvailableAsync() {
    return true;
  }

  @LynxMethod
  public boolean preventScreenCapture() {
    if (mContext instanceof android.app.Activity) {
      ((android.app.Activity) mContext)
          .getWindow()
          .addFlags(WindowManager.LayoutParams.FLAG_SECURE);
    }
    return true;
  }

  @LynxMethod
  public boolean allowScreenCapture() {
    if (mContext instanceof android.app.Activity) {
      ((android.app.Activity) mContext)
          .getWindow()
          .clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
    }
    return true;
  }

  @LynxMethod
  public WritableMap permissionsAsync() {
    WritableMap map = new JavaOnlyMap();
    map.putBoolean("granted", true);
    map.putString("status", "granted");
    map.putBoolean("canAskAgain", true);
    map.putString("expires", "never");
    return map;
  }

  @LynxMethod
  public WritableMap requestPermissionsAsync() {
    WritableMap map = new JavaOnlyMap();
    map.putBoolean("granted", true);
    map.putString("status", "granted");
    map.putBoolean("canAskAgain", true);
    map.putString("expires", "never");
    return map;
  }
}
