// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.content.SharedPreferences;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.securestore.generated.SecureStoreModuleSpec;
import com.lynx.jsbridge.Promise;
import java.lang.reflect.Method;

/**
 * Android counterpart of the iOS {@code SecureStoreModule}. Exposes an
 * encrypted key/value store to JS via {@code NativeModules.SecureStoreModule},
 * faithfully porting the native method surface of Expo's
 * {@code expo-secure-store} (latest) module. Method names MUST match the iOS
 * {@code methodLookup} keys so the shared {@code @lynxpo/mods-secure-store}
 * accessors resolve on both platforms.
 *
 * <p>The encrypted backend is AndroidX {@code EncryptedSharedPreferences},
 * which requires API 23+ symbols ({@code androidx.security.crypto.*}) that the
 * Explorer build's effective compile {@code android.jar} does not expose.
 * Those classes are therefore reached via reflection; on API < 23 the module
 * transparently falls back to a private-mode {@link SharedPreferences} (not
 * world-readable) and reports {@code isAvailable() == false} so the caller
 * knows the store is not hardware-backed. This mirrors how
 * {@code LocalAuthenticationModule} handles its own API-23+ reflection need.
 */
@LynxNativeModule(name = "SecureStoreModule")
public class SecureStoreModule extends SecureStoreModuleSpec {

  private static final String PREF_FILE = "lynxpo_secure_store";
  private static final String FALLBACK_PREF_FILE = "lynxpo_secure_store_fallback";

  public SecureStoreModule(Context context) {
    super(context);
  }

  private Object getEncryptedPrefs() {
    try {
      Class<?> espClass =
          Class.forName("androidx.security.crypto.EncryptedSharedPreferences");
      Class<?> masterKeyClass = Class.forName("androidx.security.crypto.MasterKey");
      Class<?> keySchemeClass =
          Class.forName("androidx.security.crypto.MasterKey$KeyScheme");
      Class<?> prefKeySchemeClass =
          Class.forName(
              "androidx.security.crypto.EncryptedSharedPreferences$PrefKeyEncryptionScheme");
      Class<?> prefValueSchemeClass =
          Class.forName(
              "androidx.security.crypto.EncryptedSharedPreferences$PrefValueEncryptionScheme");

      // MasterKey.Builder(context).setKeyScheme(AES256_GCM).build()
      Class<?> builderClass =
          Class.forName("androidx.security.crypto.MasterKey$Builder");
      Object builder =
          builderClass
              .getConstructor(Context.class)
              .newInstance(mContext);
      Object aes256Gcm = keySchemeClass.getField("AES256_GCM").get(null);
      builder = builderClass.getMethod("setKeyScheme", keySchemeClass).invoke(builder, aes256Gcm);
      Object masterKey = builderClass.getMethod("build").invoke(builder);

      Object keyScheme = prefKeySchemeClass.getField("AES256_SIV").get(null);
      Object valueScheme = prefValueSchemeClass.getField("AES256_GCM").get(null);

      Method create =
          espClass.getMethod(
              "create",
              Context.class,
              String.class,
              masterKeyClass,
              prefKeySchemeClass,
              prefValueSchemeClass);
      return create.invoke(null, mContext, PREF_FILE, masterKey, keyScheme, valueScheme);
    } catch (Exception e) {
      return null;
    }
  }

  private SharedPreferences getFallbackPrefs() {
    return mContext.getSharedPreferences(FALLBACK_PREF_FILE, Context.MODE_PRIVATE);
  }

  private SharedPreferences resolvePrefs() {
    Object encrypted = getEncryptedPrefs();
    if (encrypted instanceof SharedPreferences) {
      return (SharedPreferences) encrypted;
    }
    return getFallbackPrefs();
  }

  @LynxMethod
  public boolean isAvailable() {
    return getEncryptedPrefs() instanceof SharedPreferences;
  }

  @LynxMethod
  public void setItemAsync(
      final String key, final String value, final Promise promise) {
    try {
      if (key == null || value == null) {
        promise.reject("ERR_SECURE_STORE", "key and value are required");
        return;
      }
      resolvePrefs().edit().putString(key, value).apply();
      promise.resolve(null);
    } catch (Exception e) {
      promise.reject("ERR_SECURE_STORE", e.getMessage());
    }
  }

  @LynxMethod
  public void getItemAsync(final String key, final Promise promise) {
    try {
      if (key == null) {
        promise.reject("ERR_SECURE_STORE", "key is required");
        return;
      }
      String value = resolvePrefs().getString(key, null);
      promise.resolve(value);
    } catch (Exception e) {
      promise.reject("ERR_SECURE_STORE", e.getMessage());
    }
  }

  @LynxMethod
  public void deleteItemAsync(final String key, final Promise promise) {
    try {
      if (key == null) {
        promise.reject("ERR_SECURE_STORE", "key is required");
        return;
      }
      resolvePrefs().edit().remove(key).apply();
      promise.resolve(null);
    } catch (Exception e) {
      promise.reject("ERR_SECURE_STORE", e.getMessage());
    }
  }

  @LynxMethod
  public void isAvailableAsync(final Promise promise) {
    try {
      promise.resolve(isAvailable());
    } catch (Exception e) {
      promise.reject("ERR_SECURE_STORE", e.getMessage());
    }
  }
}
