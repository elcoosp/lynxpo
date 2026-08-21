// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.imagemanipulator.generated.ImageManipulatorSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;

/**
 * Android counterpart of the iOS ImageManipulator. Exposes functionality to JS via
 * NativeModules.ImageManipulator, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "ImageManipulator")
public class ImageManipulator extends ImageManipulatorSpec {

  public ImageManipulator(Context context) {
    super(context);
  }

  @LynxMethod
  public WritableMap manipulateAsync(String uri, String actions, String saveOptions) {
    WritableMap m = new JavaOnlyMap();
    m.putString("source", "LynxPo: ImageManipulator.manipulateAsync (stub)");
    m.putBoolean("available", true);
    return m;
  }

  @LynxMethod
  public boolean isAvailableAsync(String uri) {
    return true;
  }

}
