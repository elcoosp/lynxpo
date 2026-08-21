// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.taskmanager.generated.TaskManagerSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.JavaOnlyArray;

/**
 * Android counterpart of the iOS {@code TaskManager}. Exposes functionality to JS via
 * {@code NativeModules.TaskManager}, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "TaskManager")
public class TaskManager extends TaskManagerSpec {

  public TaskManager(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isTaskRegistered(String taskName) {
    return false;
  }

  @LynxMethod
  public WritableArray getRegisteredTasks() {
    return new com.lynx.react.bridge.JavaOnlyArray();
  }

  @LynxMethod
  public void unregisterTaskAsync(String taskName) {
  }

}
