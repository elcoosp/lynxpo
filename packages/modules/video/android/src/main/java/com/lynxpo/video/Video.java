// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.video.generated.VideoSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.JavaOnlyArray;

/**
 * Android counterpart of the iOS {@code Video}. Exposes functionality to JS via
 * {@code NativeModules.Video}, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "Video")
public class Video extends VideoSpec {

  public Video(Context context) {
    super(context);
  }

  @LynxMethod
  public WritableMap getStatus() {
    WritableMap m = new JavaOnlyMap();
    m.putBoolean("isPlaying", false);
    m.putDouble("duration", 0.0);
    m.putDouble("position", 0.0);
    m.putBoolean("isMuted", false);
    m.putDouble("volume", 1.0);
    return m;
  }

  @LynxMethod
  public void play() {
  }

  @LynxMethod
  public void pause() {
  }

  @LynxMethod
  public void setVolume(Double volume) {
  }

  @LynxMethod
  public void setMuted(Boolean muted) {
  }

}
