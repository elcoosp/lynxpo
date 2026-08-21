// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.statusbar.generated.StatusBarSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.JavaOnlyArray;

/**
 * Android counterpart of the iOS {@code StatusBar}. Exposes functionality to JS via
 * {@code NativeModules.StatusBar}, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "StatusBar")
public class StatusBar extends StatusBarSpec {

  public StatusBar(Context context) {
    super(context);
  }

  @LynxMethod
  public void setStyle(String style) {
  }

  @LynxMethod
  public void setHidden(Boolean hidden) {
  }

  @LynxMethod
  public void setNetworkActivityIndicatorVisible(Boolean visible) {
  }

  @LynxMethod
  public void setBackgroundColor(String color) {
  }

}
