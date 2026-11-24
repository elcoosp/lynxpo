// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import com.lynx.tasm.behavior.LynxContext;
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

  public FileSystemModule(LynxContext context) {
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
  public Object writeAsStringAsync(
      final String path, final String contents) {
    try {
      if (path == null || contents == null) {
        throw new RuntimeException("path and contents are required");
      }
      File file = resolve(path);
      File parent = file.getParentFile();
      if (parent != null) {
        parent.mkdirs();
      }
      java.nio.file.Files.write(
          file.toPath(), contents.getBytes(StandardCharsets.UTF_8));
      return null;
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  @LynxMethod
  public Object readAsStringAsync(final String path) {
    try {
      if (path == null) {
        throw new RuntimeException("path is required");
      }
      File file = resolve(path);
      if (!file.exists() || !file.isFile()) {
        throw new RuntimeException("ENOENT: " + path);
      }
      return new String(
          java.nio.file.Files.readAllBytes(file.toPath()),
          StandardCharsets.UTF_8);
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  @LynxMethod
  public Object getInfoAsync(final String path) {
    try {
      if (path == null) {
        throw new RuntimeException("path is required");
      }
      File file = resolve(path);
      JavaOnlyMap info = new JavaOnlyMap();
      info.putBoolean("exists", file.exists());
      info.putBoolean("isDirectory", file.isDirectory());
      info.putDouble("size", file.exists() ? (double) file.length() : 0.0);
      info.putString("uri", file.toURI().toString());
      return info;
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  @LynxMethod
  public Object makeDirectoryAsync(final String path) {
    try {
      if (path == null) {
        throw new RuntimeException("path is required");
      }
      File dir = resolve(path);
      dir.mkdirs();
      return null;
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  @LynxMethod
  public Object deleteAsync(final String path) {
    try {
      if (path == null) {
        throw new RuntimeException("path is required");
      }
      File file = resolve(path);
      if (!file.exists()) {
        return null;
      }
      deleteRecursive(file);
      return null;
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
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
