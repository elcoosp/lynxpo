// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.telephony.TelephonyManager;
import androidx.core.content.ContextCompat;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.cellular.generated.CellularModuleSpec;
import com.lynx.jsbridge.Promise;

/**
 * Android counterpart of the iOS {@code CellularModule}. Exposes cellular info
 * to JS via {@code NativeModules.CellularModule}, faithfully porting the native
 * method surface of Expo's {@code expo-cellular} (latest) module. Method names
 * MUST match the iOS methodLookup keys so the shared {@code @lynxpo/mods-
 * cellular} accessors resolve on both platforms.
 *
 * <p>The permission surface (READ_PHONE_STATE) is intentionally omitted; the
 * getters return the best-effort value and gracefully fall back to defaults
 * when the permission is unavailable, mirroring Expo's exception handling.
 */
@LynxNativeModule(name = "CellularModule")
public class CellularModule extends CellularModuleSpec {

  public CellularModule(Context context) {
    super(context);
  }

  @LynxMethod
  public int getCellularGeneration() {
    TelephonyManager tm = telephonyManager();
    if (tm == null) {
      return 0; // UNKNOWN
    }
    if (mContext.checkSelfPermission(Manifest.permission.READ_PHONE_STATE)
        != PackageManager.PERMISSION_GRANTED) {
      return 0; // UNKNOWN without permission
    }
    switch (tm.getDataNetworkType()) {
      case TelephonyManager.NETWORK_TYPE_GPRS:
      case TelephonyManager.NETWORK_TYPE_EDGE:
      case TelephonyManager.NETWORK_TYPE_CDMA:
      case TelephonyManager.NETWORK_TYPE_1xRTT:
      case TelephonyManager.NETWORK_TYPE_IDEN:
        return 1; // 2G
      case TelephonyManager.NETWORK_TYPE_UMTS:
      case TelephonyManager.NETWORK_TYPE_EVDO_0:
      case TelephonyManager.NETWORK_TYPE_EVDO_A:
      case TelephonyManager.NETWORK_TYPE_HSDPA:
      case TelephonyManager.NETWORK_TYPE_HSUPA:
      case TelephonyManager.NETWORK_TYPE_HSPA:
      case TelephonyManager.NETWORK_TYPE_EVDO_B:
      case TelephonyManager.NETWORK_TYPE_EHRPD:
      case TelephonyManager.NETWORK_TYPE_HSPAP:
        return 2; // 3G
      case TelephonyManager.NETWORK_TYPE_LTE:
        return 3; // 4G
      case TelephonyManager.NETWORK_TYPE_NR:
        return 4; // 5G
      default:
        return 0; // UNKNOWN
    }
  }

  @LynxMethod
  public String getIsoCountryCode() {
    TelephonyManager tm = telephonyManager();
    return tm != null ? tm.getSimCountryIso() : null;
  }

  @LynxMethod
  public String getCarrierName() {
    TelephonyManager tm = telephonyManager();
    return tm != null ? tm.getSimOperatorName() : null;
  }

  @LynxMethod
  public String getMobileCountryCode() {
    TelephonyManager tm = telephonyManager();
    if (tm == null || tm.getSimOperator() == null || tm.getSimOperator().length() < 3) {
      return null;
    }
    return tm.getSimOperator().substring(0, 3);
  }

  @LynxMethod
  public String getMobileNetworkCode() {
    TelephonyManager tm = telephonyManager();
    if (tm == null || tm.getSimOperator() == null || tm.getSimOperator().length() < 3) {
      return null;
    }
    return tm.getSimOperator().substring(3);
  }

  private TelephonyManager telephonyManager() {
    return (TelephonyManager) mContext.getSystemService(Context.TELEPHONY_SERVICE);
  }

  @LynxMethod
  public void getCellularGenerationAsync(final Promise promise) {
    try { promise.resolve(getCellularGeneration()); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
  @LynxMethod
  public void getIsoCountryCodeAsync(final Promise promise) {
    try { promise.resolve(getIsoCountryCode()); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
  @LynxMethod
  public void getCarrierNameAsync(final Promise promise) {
    try { promise.resolve(getCarrierName()); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
  @LynxMethod
  public void getMobileCountryCodeAsync(final Promise promise) {
    try { promise.resolve(getMobileCountryCode()); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
  @LynxMethod
  public void getMobileNetworkCodeAsync(final Promise promise) {
    try { promise.resolve(getMobileNetworkCode()); } catch (Exception e) { promise.reject("ERR_LYNX_MODULE", e.getMessage()); }
  }
}
