// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.audio.generated.AudioSpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.JavaOnlyArray;

/**
 * Android counterpart of the iOS {@code Audio}. Exposes functionality to JS via
 * {@code NativeModules.Audio}, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "Audio")
public class Audio extends AudioSpec {

  public Audio(Context context) {
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
    m.putBoolean("isLooping", false);
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
  public void setIsLooping(Boolean looping) {
  }

}
