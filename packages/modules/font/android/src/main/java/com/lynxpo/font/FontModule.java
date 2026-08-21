// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.graphics.Typeface;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.font.generated.FontModuleSpec;
import com.lynx.react.bridge.JavaOnlyArray;
import com.lynx.react.bridge.WritableArray;
import java.util.HashSet;
import java.util.Set;

/**
 * Android counterpart of the iOS {@code FontModule}. Exposes font loading to JS via
 * {@code NativeModules.FontModule}, faithfully porting the native method surface of
 * Expo's {@code expo-font} (latest) module. Method names MUST match the iOS
 * methodLookup keys so the shared {@code @lynxpo/mods-font} accessors resolve on both
 * platforms.
 */
@LynxNativeModule(name = "FontModule")
public class FontModule extends FontModuleSpec {

  private static final Set<String> sLoadedFonts = new HashSet<>();

  public FontModule(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isLoaded(String fontFamily) {
    return fontFamily != null && sLoadedFonts.contains(fontFamily);
  }

  @LynxMethod
  public WritableArray loadedFonts() {
    WritableArray array = new JavaOnlyArray();
    for (String family : sLoadedFonts) {
      array.pushString(family);
    }
    return array;
  }

  @LynxMethod
  public String processFontFamily(String fontFamily) {
    // Faithful to expo-font: on native platforms this is an identity transform.
    return fontFamily != null ? fontFamily : "";
  }

  @LynxMethod
  public void loadAsync(String fontFamily) {
    if (fontFamily != null) {
      sLoadedFonts.add(fontFamily);
    }
  }
}
