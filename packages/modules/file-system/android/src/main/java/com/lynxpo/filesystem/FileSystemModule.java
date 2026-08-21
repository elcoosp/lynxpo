// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.os.Environment;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.filesystem.generated.FileSystemModuleSpec;
import com.lynx.jsbridge.Promise;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import com.lynx.react.bridge.JavaOnlyMap;

/**
 * Android counterpart of the iOS {@code FileSystemModule}. Exposes a scoped
 * document/file-system surface to JS via {@code NativeModules.FileSystemModule},
 * faithfully porting the core of Expo's {@code expo-file-system} (latest)
 * module. Method names MUST match the iOS {@code methodLookup} keys so the
 * shared {@code @lynxpo/mods-file-system} accessors resolve on both platforms.
 *
 * <p>All paths are resolved relative to the app's internal files directory
 * ({@code Context.getFilesDir()}) so the module never touches external storage
 * or requires permission. A leading slash is stripped and {@code ../} segments
 * are rejected to keep writes inside the sandbox.
 */
@LynxNativeModule(name = "FileSystemModule")
public class FileSystemModule extends FileSystemModuleSpec {

  public FileSystemModule(Context context) {
    super(context);
  }

  private File resolve(String path) throws IOException {
    if (path == null || path.isEmpty()) {
      throw new IOException("path is required");
    }
    String clean = path.startsWith("/") ? path.substring(1) : path;
    if (clean.contains("..")) {
      throw new IOException("path escapes sandbox: " + path);
    }
    return new File(mContext.getFilesDir(), clean);
  }

  @LynxMethod
  public void writeAsStringAsync(
      final String path, final String contents, final Promise promise) {
    try {
      if (path == null || contents == null) {
        promise.reject("ERR_FILE_SYSTEM", "path and contents are required");
        return;
      }
      File file = resolve(path);
      File parent = file.getParentFile();
      if (parent != null) {
        parent.mkdirs();
      }
      java.nio.file.Files.write(
          file.toPath(), contents.getBytes(StandardCharsets.UTF_8));
      promise.resolve(null);
    } catch (Exception e) {
      promise.reject("ERR_FILE_SYSTEM", e.getMessage());
    }
  }

  @LynxMethod
  public void readAsStringAsync(final String path, final Promise promise) {
    try {
      if (path == null) {
        promise.reject("ERR_FILE_SYSTEM", "path is required");
        return;
      }
      File file = resolve(path);
      if (!file.exists() || !file.isFile()) {
        promise.reject("ERR_FILE_SYSTEM", "ENOENT: " + path);
        return;
      }
      String contents = new String(
          java.nio.file.Files.readAllBytes(file.toPath()),
          StandardCharsets.UTF_8);
      promise.resolve(contents);
    } catch (Exception e) {
      promise.reject("ERR_FILE_SYSTEM", e.getMessage());
    }
  }

  @LynxMethod
  public void getInfoAsync(final String path, final Promise promise) {
    try {
      if (path == null) {
        promise.reject("ERR_FILE_SYSTEM", "path is required");
        return;
      }
      File file = resolve(path);
      JavaOnlyMap info = new JavaOnlyMap();
      info.putBoolean("exists", file.exists());
      info.putBoolean("isDirectory", file.isDirectory());
      info.putDouble("size", file.exists() ? (double) file.length() : 0.0);
      info.putString("uri", file.toURI().toString());
      promise.resolve(info);
    } catch (Exception e) {
      promise.reject("ERR_FILE_SYSTEM", e.getMessage());
    }
  }

  @LynxMethod
  public void makeDirectoryAsync(final String path, final Promise promise) {
    try {
      if (path == null) {
        promise.reject("ERR_FILE_SYSTEM", "path is required");
        return;
      }
      File dir = resolve(path);
      boolean ok = dir.mkdirs();
      promise.resolve(ok || dir.isDirectory());
    } catch (Exception e) {
      promise.reject("ERR_FILE_SYSTEM", e.getMessage());
    }
  }

  @LynxMethod
  public void deleteAsync(final String path, final Promise promise) {
    try {
      if (path == null) {
        promise.reject("ERR_FILE_SYSTEM", "path is required");
        return;
      }
      File file = resolve(path);
      if (!file.exists()) {
        promise.resolve(null);
        return;
      }
      boolean ok = deleteRecursive(file);
      promise.resolve(ok);
    } catch (Exception e) {
      promise.reject("ERR_FILE_SYSTEM", e.getMessage());
    }
  }

  private boolean deleteRecursive(File file) {
    if (file.isDirectory()) {
      File[] children = file.listFiles();
      if (children != null) {
        for (File child : children) {
          deleteRecursive(child);
        }
      }
    }
    return file.delete();
  }
}
