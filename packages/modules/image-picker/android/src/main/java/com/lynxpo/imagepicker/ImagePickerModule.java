// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynxpo.imagepicker;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.imagepicker.generated.ImagePickerModuleSpec;
import com.lynx.react.bridge.Callback;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableMap;
import com.lynx.tasm.utils.ContextUtils;
import java.io.File;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Android counterpart of the iOS {@code ImagePickerModule}. Exposes permission
 * status to JS via {@code NativeModules.ImagePickerModule}, faithfully porting
 * the native method surface of Expo's {@code expo-image-picker} (latest)
 * module. Method names MUST match the iOS methodLookup keys so the shared
 * {@code @lynxpo/mods-image-picker} accessors resolve on both platforms.
 *
 * <p>{@code launchCameraAsync}/{@code launchImageLibraryAsync} start the system
 * camera / photo picker (via {@link ImagePickerProxyActivity}) and resolve with
 * {@code {cancelled, uri}}, matching the iOS return shape. The async permission
 * getters actually {@code requestPermissions} (routing through the proxy
 * activity) and resolve with the resulting status, mirroring iOS. Results are
 * delivered through the deprecated native promise API ({@code Callback}).
 */
@LynxNativeModule(name = "ImagePickerModule")
public class ImagePickerModule extends ImagePickerModuleSpec {

  static final String EXTRA_PICKER_ACTION = "lynxpo.picker.action";
  static final String EXTRA_CAMERA_URI = "lynxpo.picker.camera_uri";
  static final String EXTRA_REQUEST_PERMISSIONS = "lynxpo.picker.permissions";
  static final int ACTION_LIBRARY = 1;
  static final int ACTION_CAMERA = 2;
  static final int REQUEST_CODE = 0x4C59; // "LYNX"

  private static final AtomicReference<Object> PENDING_CB = new AtomicReference<>();
  private static final AtomicReference<Uri> PENDING_CAMERA_URI = new AtomicReference<>();

  /** Resolve with {@code {cancelled, uri}} (picker result). */
  static void resolvePicked(@Nullable Uri uri, boolean cancelled) {
    Object cb = PENDING_CB.getAndSet(null);
    PENDING_CAMERA_URI.set(null);
    if (cb instanceof Callback) {
      WritableMap result = new JavaOnlyMap();
      result.putBoolean("cancelled", cancelled);
      if (!cancelled) {
        result.putString("uri", uri != null ? uri.toString() : null);
      }
      ((Callback) cb).invoke(result);
    }
  }

  /** Resolve with a permission-status map (permission request result). */
  static void resolvePermission(android.content.Context context, String permission) {
    Object cb = PENDING_CB.getAndSet(null);
    if (cb instanceof Callback) {
      ((Callback) cb).invoke(buildPermissionStatus(context, permission));
    }
  }

  static void rejectPicked(String message) {
    Object cb = PENDING_CB.getAndSet(null);
    PENDING_CAMERA_URI.set(null);
    if (cb instanceof Callback) {
      ((Callback) cb).invoke(makeError(message));
    }
  }

  private static WritableMap makeError(String message) {
    WritableMap map = new JavaOnlyMap();
    map.putBoolean("cancelled", true);
    map.putString("error", message);
    return map;
  }

  private static void invokeCb(Object cb, WritableMap result) {
    if (cb instanceof Callback) {
      ((Callback) cb).invoke(result);
    }
  }

  private static void resolveError(Object cb, String message) {
    if (cb instanceof Callback) {
      ((Callback) cb).invoke(makeError(message));
    }
  }

  public ImagePickerModule(Context context) {
    super(context);
  }

  @Override
  public WritableMap getCameraPermissions() {
    return buildPermissionStatus(mContext, Manifest.permission.CAMERA);
  }

  @Override
  public WritableMap getMediaLibraryPermissions() {
    return buildPermissionStatus(mContext, mediaPermission());
  }

  private static String mediaPermission() {
    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
        ? Manifest.permission.READ_MEDIA_IMAGES
        : Manifest.permission.READ_EXTERNAL_STORAGE;
  }

  private static WritableMap buildPermissionStatus(Context context, String permission) {
    WritableMap result = new JavaOnlyMap();
    int check = ContextCompat.checkSelfPermission(context, permission);
    boolean granted = check == PackageManager.PERMISSION_GRANTED;
    result.putString("status", granted ? "granted" : "undetermined");
    result.putBoolean("granted", granted);
    result.putBoolean("canAskAgain", true);
    result.putString("expires", "never");
    return result;
  }

  @Override
  public void getCameraPermissionsAsync(final Object cb) {
    requestPermissionOrResolve(Manifest.permission.CAMERA, cb);
  }

  @Override
  public void getMediaLibraryPermissionsAsync(final Object cb) {
    requestPermissionOrResolve(mediaPermission(), cb);
  }

  private void requestPermissionOrResolve(String permission, final Object cb) {
    android.app.Activity activity = ContextUtils.getActivity(mContext);
    if (activity == null) {
      resolveError(cb, "Permission request unavailable: no host activity");
      return;
    }
    if (ContextCompat.checkSelfPermission(activity, permission)
        == PackageManager.PERMISSION_GRANTED) {
      invokeCb(cb, buildPermissionStatus(activity, permission));
      return;
    }
    PENDING_CB.set(cb);
    try {
      Intent proxy = new Intent(activity, ImagePickerProxyActivity.class);
      proxy.putExtra(EXTRA_REQUEST_PERMISSIONS, new String[] { permission });
      proxy.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      activity.startActivity(proxy);
    } catch (Exception e) {
      PENDING_CB.set(null);
      resolveError(cb, e.getMessage());
    }
  }

  @Override
  public void launchImageLibraryAsync(final Object cb) {
    android.app.Activity activity = ContextUtils.getActivity(mContext);
    if (activity == null) {
      resolveError(cb, "Image picker unavailable: no host activity");
      return;
    }
    PENDING_CB.set(cb);
    try {
      Intent proxy = new Intent(activity, ImagePickerProxyActivity.class);
      proxy.putExtra(EXTRA_PICKER_ACTION, ACTION_LIBRARY);
      proxy.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      activity.startActivity(proxy);
    } catch (Exception e) {
      PENDING_CB.set(null);
      resolveError(cb, e.getMessage());
    }
  }

  @Override
  public void launchCameraAsync(final Object cb) {
    android.app.Activity activity = ContextUtils.getActivity(mContext);
    if (activity == null) {
      resolveError(cb, "Camera unavailable: no host activity");
      return;
    }
    File photoFile =
        new File(activity.getCacheDir(), "lynxpo_camera_" + System.currentTimeMillis() + ".jpg");
    Uri cameraUri =
        FileProvider.getUriForFile(
            activity,
            activity.getApplicationContext().getPackageName() + ".fileprovider",
            photoFile);
    PENDING_CAMERA_URI.set(cameraUri);
    PENDING_CB.set(cb);
    try {
      Intent proxy = new Intent(activity, ImagePickerProxyActivity.class);
      proxy.putExtra(EXTRA_PICKER_ACTION, ACTION_CAMERA);
      proxy.putExtra(EXTRA_CAMERA_URI, cameraUri.toString());
      proxy.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      activity.startActivity(proxy);
    } catch (Exception e) {
      PENDING_CB.set(null);
      PENDING_CAMERA_URI.set(null);
      resolveError(cb, e.getMessage());
    }
  }

  @Nullable
  static Uri consumePendingCameraUri() {
    return PENDING_CAMERA_URI.getAndSet(null);
  }
}
