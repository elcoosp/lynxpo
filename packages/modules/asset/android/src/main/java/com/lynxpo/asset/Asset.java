// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.asset.generated.AssetSpec;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableMap;
import java.io.File;

/**
 * Android runtime twin of Asset (expo-asset). Provides real metadata about a
 * local file resource: size, existence, and (for files bundled in the APK
 * asset catalog) the package the asset belongs to. For a general file:/// URI
 * we resolve the real file on disk.
 */
@LynxNativeModule(name = "Asset")
public class Asset extends AssetSpec {

  public Asset(Context context) {
    super(context);
  }

  @LynxMethod
  public boolean isAvailableAsync() {
    return true;
  }

  private static String stripScheme(String uri) {
    if (uri == null) return "";
    String s = uri;
    int idx = s.indexOf("://");
    if (idx >= 0) {
      s = s.substring(idx + 3);
    }
    return s;
  }

  @LynxMethod
  public WritableMap assetInfoAsync(String uri) {
    WritableMap map = new JavaOnlyMap();
    if (uri == null || uri.isEmpty()) {
      map.putBoolean("exists", false);
      map.putDouble("size", 0);
      map.putString("name", "");
      map.putString("localUri", "");
      return map;
    }
    String path = stripScheme(uri);
    File f = new File(path);
    // If the path is relative, also try it against the app files dir.
    if (!f.exists() && mContext != null) {
      f = new File(mContext.getFilesDir(), path);
    }
    if (f.exists() && f.isFile()) {
      map.putBoolean("exists", true);
      map.putDouble("size", f.length());
      map.putString("name", f.getName());
      map.putString("localUri", "file://" + f.getAbsolutePath());
      map.putString("source", "filesystem");
    } else {
      map.putBoolean("exists", false);
      map.putDouble("size", 0);
      map.putString("name", new File(path).getName());
      map.putString("localUri", "");
      map.putString("source", "unknown");
    }
    return map;
  }

  @LynxMethod
  public String localUriAsync(String uri) {
    WritableMap info = assetInfoAsync(uri);
    // WritableMap doesn't expose getters here via JavaOnlyMap reliably, so
    // recompute directly.
    if (uri == null || uri.isEmpty()) {
      return "";
    }
    String path = stripScheme(uri);
    File f = new File(path);
    if (!f.exists() && mContext != null) {
      f = new File(mContext.getFilesDir(), path);
    }
    if (f.exists() && f.isFile()) {
      return "file://" + f.getAbsolutePath();
    }
    return "";
  }
}
