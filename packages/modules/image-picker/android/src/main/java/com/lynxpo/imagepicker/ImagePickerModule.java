// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.imagepicker.generated.ImagePickerModuleSpec;
import com.lynx.jsbridge.Promise;
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
 * activity, since the host does not forward permission callbacks to modules)
 * and resolve with the resulting status, mirroring iOS.
 */
@LynxNativeModule(name = "ImagePickerModule")
public class ImagePickerModule extends ImagePickerModuleSpec {

  static final String EXTRA_PICKER_ACTION = "lynxpo.picker.action";
  static final String EXTRA_CAMERA_URI = "lynxpo.picker.camera_uri";
  static final String EXTRA_REQUEST_PERMISSIONS = "lynxpo.picker.permissions";
  static final int ACTION_LIBRARY = 1;
  static final int ACTION_CAMERA = 2;
  static final int REQUEST_CODE = 0x4C59; // "LYNX"

  private static final AtomicReference<Promise> PENDING_PROMISE = new AtomicReference<>();
  private static final AtomicReference<Uri> PENDING_CAMERA_URI = new AtomicReference<>();

  /** Resolve with {@code {cancelled, uri}} (picker result). */
  static void resolvePicked(@Nullable Uri uri, boolean cancelled) {
    Promise promise = PENDING_PROMISE.getAndSet(null);
    PENDING_CAMERA_URI.set(null);
    if (promise == null) {
      return;
    }
    WritableMap result = new JavaOnlyMap();
    result.putBoolean("cancelled", cancelled);
    if (!cancelled) {
      result.putString("uri", uri != null ? uri.toString() : null);
    }
    promise.resolve(result);
  }

  /** Resolve with a permission-status map (permission request result). */
  static void resolvePermission(android.content.Context context, String permission) {
    Promise promise = PENDING_PROMISE.getAndSet(null);
    if (promise == null) {
      return;
    }
    promise.resolve(buildPermissionStatus(context, permission));
  }

  static void rejectPicked(String message) {
    Promise promise = PENDING_PROMISE.getAndSet(null);
    PENDING_CAMERA_URI.set(null);
    if (promise != null) {
      promise.reject("ERROR", message);
    }
  }

  public ImagePickerModule(Context context) {
    super(context);
  }

  @LynxMethod
  public WritableMap getCameraPermissions() {
    return buildPermissionStatus(mContext, Manifest.permission.CAMERA);
  }

  @LynxMethod
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

  @LynxMethod
  public void getCameraPermissionsAsync(final Promise promise) {
    requestPermissionOrResolve(Manifest.permission.CAMERA, promise);
  }

  @LynxMethod
  public void getMediaLibraryPermissionsAsync(final Promise promise) {
    requestPermissionOrResolve(mediaPermission(), promise);
  }

  private void requestPermissionOrResolve(String permission, final Promise promise) {
    android.app.Activity activity = ContextUtils.getActivity(mContext);
    if (activity == null) {
      promise.reject("ERROR", "Permission request unavailable: no host activity");
      return;
    }
    if (ContextCompat.checkSelfPermission(activity, permission)
        == PackageManager.PERMISSION_GRANTED) {
      promise.resolve(buildPermissionStatus(activity, permission));
      return;
    }
    PENDING_PROMISE.set(promise);
    try {
      Intent proxy = new Intent(activity, ImagePickerProxyActivity.class);
      proxy.putExtra(EXTRA_REQUEST_PERMISSIONS, new String[] { permission });
      proxy.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      activity.startActivity(proxy);
    } catch (Exception e) {
      PENDING_PROMISE.set(null);
      promise.reject("ERROR", e.getMessage());
    }
  }

  @LynxMethod
  public void launchImageLibraryAsync(final Promise promise) {
    android.app.Activity activity = ContextUtils.getActivity(mContext);
    if (activity == null) {
      promise.reject("ERROR", "Image picker unavailable: no host activity");
      return;
    }
    PENDING_PROMISE.set(promise);
    try {
      Intent proxy = new Intent(activity, ImagePickerProxyActivity.class);
      proxy.putExtra(EXTRA_PICKER_ACTION, ACTION_LIBRARY);
      proxy.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      activity.startActivity(proxy);
    } catch (Exception e) {
      PENDING_PROMISE.set(null);
      promise.reject("ERROR", e.getMessage());
    }
  }

  @LynxMethod
  public void launchCameraAsync(final Promise promise) {
    android.app.Activity activity = ContextUtils.getActivity(mContext);
    if (activity == null) {
      promise.reject("ERROR", "Camera unavailable: no host activity");
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
    PENDING_PROMISE.set(promise);
    try {
      Intent proxy = new Intent(activity, ImagePickerProxyActivity.class);
      proxy.putExtra(EXTRA_PICKER_ACTION, ACTION_CAMERA);
      proxy.putExtra(EXTRA_CAMERA_URI, cameraUri.toString());
      proxy.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      activity.startActivity(proxy);
    } catch (Exception e) {
      PENDING_PROMISE.set(null);
      PENDING_CAMERA_URI.set(null);
      promise.reject("ERROR", e.getMessage());
    }
  }

  @Nullable
  static Uri consumePendingCameraUri() {
    return PENDING_CAMERA_URI.getAndSet(null);
  }
}
