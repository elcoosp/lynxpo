// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.sharing.generated.SharingSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.JavaOnlyArray;

/**
 * Android counterpart of the iOS {@code Sharing}. Exposes functionality to JS via
 * {@code NativeModules.Sharing}, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "Sharing")
public class Sharing extends SharingSpec {

  public Sharing(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isAvailable() {
    return true;
  }

  @LynxMethod
  public void shareAsync(String url) {
  }

}
