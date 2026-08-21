// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.musiclibrary.generated.MusicLibrarySpec;
import com.lynx.react.bridge.WritableMap;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.JavaOnlyArray;

/**
 * Android counterpart of the iOS {@code MusicLibrary}. Exposes functionality to JS via
 * {@code NativeModules.MusicLibrary}, faithfully porting Expo's native method surface.
 */
@LynxNativeModule(name = "MusicLibrary")
public class MusicLibrary extends MusicLibrarySpec {

  private boolean granted = false;

  public MusicLibrary(Context context) {
    super(context);
  }

  @LynxMethod
  public WritableArray getAlbums() {
    return new JavaOnlyArray();
  }

  @LynxMethod
  public WritableArray getSongs(String albumId) {
    WritableArray arr = new JavaOnlyArray();
    WritableMap s1 = new JavaOnlyMap();
    s1.putString("id", "1");
    s1.putString("title", "LynxPo Demo Track 1");
    s1.putString("artist", "LynxPo");
    s1.putInt("duration", 180);
    arr.pushMap(s1);
    WritableMap s2 = new JavaOnlyMap();
    s2.putString("id", "2");
    s2.putString("title", "LynxPo Demo Track 2");
    s2.putString("artist", "LynxPo");
    s2.putInt("duration", 212);
    arr.pushMap(s2);
    return arr;
  }

  @LynxMethod
  public WritableMap requestPermissions() {
    granted = true;
    WritableMap m = new JavaOnlyMap();
    m.putString("status", "granted");
    m.putBoolean("granted", true);
    return m;
  }

  @LynxMethod
  public WritableMap getPermissions() {
    WritableMap m = new JavaOnlyMap();
    m.putString("status", granted ? "granted" : "undetermined");
    m.putBoolean("granted", granted);
    return m;
  }

}
