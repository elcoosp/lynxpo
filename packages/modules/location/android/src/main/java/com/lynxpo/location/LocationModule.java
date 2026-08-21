// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.location.LocationManager;
import android.content.pm.PackageManager;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.location.generated.LocationModuleSpec;
import com.lynx.react.bridge.JavaOnlyMap;
import com.lynx.react.bridge.WritableMap;

/**
 * Android counterpart of the iOS {@code LocationModule}. Exposes location info to JS via
 * {@code NativeModules.LocationModule}, faithfully porting the native method surface of
 * Expo's {@code expo-location} (latest) module. Method names MUST match the iOS
 * methodLookup keys so the shared {@code @lynxpo/mods-location} accessors resolve on both
 * platforms.
 */
@LynxNativeModule(name = "LocationModule")
public class LocationModule extends LocationModuleSpec {

  private boolean granted = false;

  public LocationModule(Context context) {
    super(context);
  }

  @LynxMethod
  public WritableMap providerStatus() {
    LocationManager lm = (LocationManager) mContext.getSystemService(Context.LOCATION_SERVICE);
    boolean gpsEnabled = lm != null && lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
    boolean netEnabled = lm != null && lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
    boolean fineGranted = mContext.checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION)
        == PackageManager.PERMISSION_GRANTED;
    WritableMap map = new JavaOnlyMap();
    map.putBoolean("locationServicesEnabled", gpsEnabled || netEnabled);
    map.putBoolean("gpsAvailable", gpsEnabled);
    map.putBoolean("networkAvailable", netEnabled);
    map.putBoolean("authorized", fineGranted || granted);
    return map;
  }

  @LynxMethod
  public WritableMap permissionsAsync() {
    int fine = mContext.checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION);
    int coarse = mContext.checkSelfPermission(android.Manifest.permission.ACCESS_COARSE_LOCATION);
    boolean systemGranted = (fine == PackageManager.PERMISSION_GRANTED) || (coarse == PackageManager.PERMISSION_GRANTED);
    boolean effective = systemGranted || granted;
    String status = effective ? "granted" : "undetermined";
    WritableMap map = new JavaOnlyMap();
    map.putString("status", status);
    map.putBoolean("granted", effective);
    map.putBoolean("canAskAgain", !effective);
    return map;
  }

  /**
   * Simulates the user granting location permission so the showcase button has a visible
   * effect (the headless explorer cannot present a real system dialog).
   */
  @LynxMethod
  public void requestPermission() {
    granted = true;
  }

  @LynxMethod
  public WritableMap currentPositionAsync() {
    WritableMap map = new JavaOnlyMap();
    int fine = mContext.checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION);
    int coarse = mContext.checkSelfPermission(android.Manifest.permission.ACCESS_COARSE_LOCATION);
    boolean havePerm = (fine == PackageManager.PERMISSION_GRANTED) || (coarse == PackageManager.PERMISSION_GRANTED) || granted;
    if (!havePerm) {
      map.putDouble("latitude", 0d);
      map.putDouble("longitude", 0d);
      map.putDouble("accuracy", -1d);
      return map;
    }
    LocationManager lm = (LocationManager) mContext.getSystemService(Context.LOCATION_SERVICE);
    android.location.Location loc = null;
    if (lm != null) {
      try {
        loc = lm.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        if (loc == null) loc = lm.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
      } catch (SecurityException ignored) {
        // fall through
      }
    }
    if (loc == null) {
      map.putDouble("latitude", 0d);
      map.putDouble("longitude", 0d);
      map.putDouble("accuracy", -1d);
      return map;
    }
    map.putDouble("latitude", loc.getLatitude());
    map.putDouble("longitude", loc.getLongitude());
    map.putDouble("accuracy", loc.getAccuracy());
    return map;
  }
}
