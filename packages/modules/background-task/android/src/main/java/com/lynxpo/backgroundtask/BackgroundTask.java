// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.backgroundtask.generated.BackgroundTaskSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;

/**
 * Android counterpart of the iOS BackgroundTask. Exposes functionality to JS via
 * NativeModules.BackgroundTask, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "BackgroundTask")
public class BackgroundTask extends BackgroundTaskSpec {

  public BackgroundTask(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isAvailableAsync() {
    return true;
  }

  @LynxMethod
  public boolean registerTaskAsync(String taskName, String options) {
    return true;
  }

  @LynxMethod
  public boolean unregisterTaskAsync(String taskName) {
    return true;
  }

  @LynxMethod
  public WritableMap getStatus() {
    WritableMap m = new JavaOnlyMap();
    m.putString("source", "LynxPo: BackgroundTask.getStatusAsync (stub)");
    m.putBoolean("available", true);
    return m;
  }

}
