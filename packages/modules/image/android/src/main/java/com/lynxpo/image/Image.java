// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.image.generated.ImageSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.JavaOnlyArray;

/**
 * Android counterpart of the iOS {@code Image}. Exposes functionality to JS via
 * {@code NativeModules.Image}, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "Image")
public class Image extends ImageSpec {

  public Image(Context context) {
    super(context);
  }

  @LynxMethod
  public double getCacheSize() {
    return 0.0;
  }

  @LynxMethod
  public void clearCache() {
  }

  @LynxMethod
  public boolean prefetch(String url) {
    return false;
  }

  @LynxMethod
  public boolean isImageLoading(String uri) {
    return false;
  }

  @LynxMethod
  public void cancelLoading(String uri) {
  }

}
