// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynxpo.blob;

import android.content.Context;
import android.util.Base64;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.blob.generated.BlobModuleSpec;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Android counterpart of the iOS {@code BlobModule}. Exposes a real in-memory
 * binary large-object store to JS via {@code NativeModules.BlobModule},
 * faithfully porting the native surface of Expo's {@code expo-blob} (latest)
 * module. Method names MUST match the iOS {@code methodLookup} keys and the
 * shared {@code @lynxpo/mods-blob} accessors. Bytes are base64-encoded across
 * the bridge (Lynx supported types do not include raw byte arrays). The store
 * is process-scoped, exactly like Expo's native blob manager.
 */
@LynxNativeModule(name = "BlobModule")
public class BlobModule extends BlobModuleSpec {

  // blobId -> bytes
  private final Map<String, byte[]> store = new ConcurrentHashMap<>();
  // blobId -> type
  private final Map<String, String> types = new ConcurrentHashMap<>();

  public BlobModule(Context context) {
    super(context);
  }

  private static byte[] decode(String payload) {
    if (payload == null || payload.isEmpty()) return new byte[0];
    try {
      return Base64.decode(payload, Base64.NO_WRAP);
    } catch (IllegalArgumentException e) {
      return new byte[0];
    }
  }

  @LynxMethod
  public String create(String payload, String type) {
    try {
      byte[] data = decode(payload);
      String blobId = UUID.randomUUID().toString();
      store.put(blobId, data);
      types.put(blobId, type == null ? "" : type);
      return blobId;
    } catch (Exception e) {
      return null;
    }
  }

  @LynxMethod
  public double size(String blobId) {
    byte[] data = store.get(blobId);
    return data != null ? (double) data.length : 0.0;
  }

  @LynxMethod
  public String type(String blobId) {
    String t = types.get(blobId);
    return t != null ? t : "";
  }

  @LynxMethod
  public String slice(String blobId, double start, double end, String contentType) {
    try {
      byte[] data = store.get(blobId);
      if (data == null) return null;
      int len = data.length;
      int s = (int) start;
      int e = (int) end;
      if (s < 0) s = 0;
      if (e > len || e < 0) e = len;
      if (s > e) s = e;
      byte[] sliced = new byte[e - s];
      System.arraycopy(data, s, sliced, 0, e - s);
      String newId = UUID.randomUUID().toString();
      store.put(newId, sliced);
      types.put(newId, contentType == null ? "" : contentType);
      return newId;
    } catch (Exception ex) {
      return null;
    }
  }

  @LynxMethod
  public String bytes(String blobId) {
    try {
      byte[] data = store.get(blobId);
      if (data == null) return null;
      return Base64.encodeToString(data, Base64.NO_WRAP);
    } catch (Exception e) {
      return null;
    }
  }

  @LynxMethod
  public String text(String blobId) {
    try {
      byte[] data = store.get(blobId);
      if (data == null) return null;
      return new String(data, StandardCharsets.UTF_8);
    } catch (Exception e) {
      return null;
    }
  }

  @LynxMethod
  public String arrayBuffer(String blobId) {
    // ArrayBuffer of a blob is its raw bytes; base64-encoded across the bridge.
    return bytes(blobId);
  }
}
