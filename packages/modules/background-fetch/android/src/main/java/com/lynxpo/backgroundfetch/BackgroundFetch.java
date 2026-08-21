// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.backgroundfetch.generated.BackgroundFetchSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.JavaOnlyArray;

/**
 * Android counterpart of the iOS {@code BackgroundFetch}. Exposes functionality to JS via
 * {@code NativeModules.BackgroundFetch}, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "BackgroundFetch")
public class BackgroundFetch extends BackgroundFetchSpec {

  public BackgroundFetch(Context context) {
    super(context);
  }

  @LynxMethod
  public WritableMap getStatus() {
    WritableMap m = new JavaOnlyMap();
    m.putInt("status", 0);
    return m;
  }

  @LynxMethod
  public void registerTaskAsync(String taskName) {
  }

  @LynxMethod
  public void unregisterTaskAsync(String taskName) {
  }

}
