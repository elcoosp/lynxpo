// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.medialibrary.generated.MediaLibraryModuleSpec;
import com.lynx.react.bridge.JavaOnlyArray;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableArray;
import com.lynx.react.bridge.WritableMap;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Android counterpart of the iOS {@code MediaLibraryModule}. Exposes media library to JS via
 * {@code NativeModules.MediaLibraryModule}, faithfully porting the native method surface of
 * Expo's {@code expo-media-library} (latest) module. Method names MUST match the iOS
 * methodLookup keys so the shared {@code @lynxpo/mods-media-library} accessors resolve on both
 * platforms.
 */
@LynxNativeModule(name = "MediaLibraryModule")
public class MediaLibraryModule extends MediaLibraryModuleSpec {

  public MediaLibraryModule(Context context) {
    super(context);
  }

  private boolean hasPermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      return mContext.checkSelfPermission(android.Manifest.permission.READ_MEDIA_IMAGES)
          == android.content.pm.PackageManager.PERMISSION_GRANTED;
    }
    return mContext.checkSelfPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE)
        == android.content.pm.PackageManager.PERMISSION_GRANTED;
  }

  @LynxMethod
  public WritableMap permissionsAsync() {
    boolean granted = hasPermission();
    WritableMap map = new JavaOnlyMap();
    map.putString("status", granted ? "granted" : "undetermined");
    map.putBoolean("granted", granted);
    return map;
  }

  /**
   * Asks the host activity to present the system media-permission dialog. The explorer
   * constructs this module with the activity context, so we cast and delegate.
   */
  @LynxMethod
  public void requestPermission() {
    if (mContext instanceof androidx.appcompat.app.AppCompatActivity) {
      androidx.appcompat.app.AppCompatActivity activity =
          (androidx.appcompat.app.AppCompatActivity) mContext;
      String[] perms;
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        perms = new String[] { android.Manifest.permission.READ_MEDIA_IMAGES };
      } else {
        perms = new String[] { android.Manifest.permission.READ_EXTERNAL_STORAGE };
      }
      androidx.core.app.ActivityCompat.requestPermissions(
          activity, perms, MEDIA_PERMISSION_REQUEST_CODE);
    }
  }

  private static final int MEDIA_PERMISSION_REQUEST_CODE = 2003;

  @LynxMethod
  public WritableArray albumsAsync() {
    WritableArray array = new JavaOnlyArray();
    if (!hasPermission()) return array;
    try {
      Uri uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
      String[] projection = { MediaStore.Images.Media.BUCKET_DISPLAY_NAME };
      Set<String> buckets = new HashSet<>();
      Cursor c = mContext.getContentResolver().query(uri, projection, null, null, null);
      if (c != null) {
        int idx = c.getColumnIndex(MediaStore.Images.Media.BUCKET_DISPLAY_NAME);
        while (c.moveToNext()) {
          String name = c.getString(idx);
          if (name != null) buckets.add(name);
        }
        c.close();
      }
      for (String name : buckets) {
        WritableMap album = new JavaOnlyMap();
        album.putString("title", name);
        album.putInt("assetCount", 0);
        array.pushMap(album);
      }
    } catch (Exception ignored) {
      // return what we have
    }
    return array;
  }

  @LynxMethod
  public WritableMap assetsAsync() {
    WritableMap map = new JavaOnlyMap();
    if (!hasPermission()) {
      map.putInt("totalCount", 0);
      map.putBoolean("hasNextPage", false);
      return map;
    }
    int count = 0;
    try {
      Uri uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
      Cursor c = mContext.getContentResolver().query(uri, new String[] { MediaStore.Images.Media._ID }, null, null, null);
      if (c != null) {
        count = c.getCount();
        c.close();
      }
    } catch (Exception ignored) {
      // fall through
    }
    map.putInt("totalCount", count);
    map.putBoolean("hasNextPage", false);
    return map;
  }
}
