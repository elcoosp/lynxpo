// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
package com.lynx.explorer.modules;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;
import android.os.PowerManager;
import com.lynx.jsbridge.LynxMethod;
import com.lynx.jsbridge.LynxModule;
import com.lynx.jsbridge.LynxNativeModule;
import com.lynxpo.battery.generated.BatteryModuleSpec;

/**
 * Android counterpart of the iOS {@code BatteryModule}. Exposes battery info to
 * JS via {@code NativeModules.BatteryModule}, faithfully porting the native
 * method surface of Expo's {@code expo-battery} (v57) module. Method names MUST
 * match the iOS methodLookup keys so the shared {@code @lynxpo/mods-battery}
 * accessors resolve on both platforms.
 *
 * <p>Expo wraps these in async TS helpers; the underlying native calls are
 * synchronous, so they are exposed here as synchronous {@link LynxMethod}s
 * returning the raw native value (level 0..1, state enum int, low-power bool).
 * The event/listener surface of expo-battery is intentionally omitted — it
 * requires an async event bridge beyond this module's synchronous contract.
 */
@LynxNativeModule(name = "BatteryModule")
public class BatteryModule extends BatteryModuleSpec {

  public BatteryModule(Context context) {
    super(context);
  }

  @LynxMethod
  public double getBatteryLevel() {
    Intent batteryIntent =
        mContext.registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    if (batteryIntent == null) {
      return -1d;
    }
    int level = batteryIntent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
    int scale = batteryIntent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
    if (level < 0 || scale <= 0) {
      return -1d;
    }
    return (double) level / (double) scale;
  }

  @LynxMethod
  public int getBatteryState() {
    Intent batteryIntent =
        mContext.registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    if (batteryIntent == null) {
      return 0; // UNKNOWN
    }
    int status = batteryIntent.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
    int plugged = batteryIntent.getIntExtra(BatteryManager.EXTRA_PLUGGED, 0);
    switch (status) {
      case BatteryManager.BATTERY_STATUS_FULL:
        return 3; // FULL
      case BatteryManager.BATTERY_STATUS_CHARGING:
        return 2; // CHARGING
      case BatteryManager.BATTERY_STATUS_NOT_CHARGING:
        return plugged != 0 ? 4 : 1; // NOT_CHARGING : UNPLUGGED
      case BatteryManager.BATTERY_STATUS_DISCHARGING:
        return 1; // UNPLUGGED
      default:
        return 0; // UNKNOWN
    }
  }

  @LynxMethod
  public boolean isLowPowerModeEnabled() {
    PowerManager pm = (PowerManager) mContext.getSystemService(Context.POWER_SERVICE);
    return pm != null && pm.isPowerSaveMode();
  }

  @LynxMethod
  public boolean isBatteryOptimizationEnabled() {
    PowerManager pm = (PowerManager) mContext.getSystemService(Context.POWER_SERVICE);
    if (pm == null) {
      return false;
    }
    return !pm.isIgnoringBatteryOptimizations(mContext.getPackageName());
  }
}
