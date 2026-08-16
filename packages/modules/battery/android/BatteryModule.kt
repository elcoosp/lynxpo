package com.lynx.explorer.modules

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.os.PowerManager
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for the `@lynxpo/mods-battery` package. The ktts
 * plugin reads this file and generates `src/index.ts` (the `getX`/`useX`
 * accessors). Method names mirror Expo's `expo-battery` (v57) native module
 * surface, reusing its implementation logic. The runtime twin of this module
 * lives in the Lynx Explorer as `BatteryModule` (registered via nmi).
 */
class BatteryModule(private val context: Context) : LynxModule(context) {
  @LynxMethod
  fun getBatteryLevel() = run {
    val intent = context.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
    if (intent == null) {
      -1.0
    } else {
      val level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1)
      val scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
      if (level < 0 || scale <= 0) -1.0 else level.toDouble() / scale.toDouble()
    }
  }

  @LynxMethod
  fun getBatteryState() = run {
    val intent = context.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
    if (intent == null) {
      0
    } else {
      val status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1)
      val plugged = intent.getIntExtra(BatteryManager.EXTRA_PLUGGED, 0)
      when (status) {
        BatteryManager.BATTERY_STATUS_FULL -> 3
        BatteryManager.BATTERY_STATUS_CHARGING -> 2
        BatteryManager.BATTERY_STATUS_NOT_CHARGING -> if (plugged != 0) 4 else 1
        BatteryManager.BATTERY_STATUS_DISCHARGING -> 1
        else -> 0
      }
    }
  }

  @LynxMethod
  fun isLowPowerModeEnabled() = run {
    val pm = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
    pm?.isPowerSaveMode ?: false
  }

  @LynxMethod
  fun isBatteryOptimizationEnabled() = run {
    val pm = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
    pm?.isIgnoringBatteryOptimizations(context.packageName)?.not() ?: false
  }
}
