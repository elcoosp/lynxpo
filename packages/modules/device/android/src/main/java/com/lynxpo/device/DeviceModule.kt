package com.lynxpo.device

import com.lynx.jsbridge.LynxNativeModule
import com.lynxpo.device.generated.DeviceModuleSpec

import android.content.Context
import android.content.res.Configuration
import android.os.Build
import android.view.WindowManager
import com.facebook.device.yearclass.YearClass

import java.io.File
import kotlin.math.pow
import kotlin.math.sqrt
import java.util.*

object EmulatorUtilities {
  fun isRunningOnEmulator(): Boolean {
    return Build.FINGERPRINT.startsWith("generic") ||
      Build.FINGERPRINT.startsWith("unknown") ||
      Build.MODEL.contains("google_sdk") ||
      Build.MODEL.lowercase(Locale.ROOT).contains("droid4x") ||
      Build.MODEL.contains("Emulator") ||
      Build.MODEL.contains("Android SDK built for x86") ||
      Build.MANUFACTURER.contains("Genymotion") ||
      Build.HARDWARE.contains("goldfish") ||
      Build.HARDWARE.contains("ranchu") ||
      Build.HARDWARE.contains("vbox86") ||
      Build.PRODUCT.contains("sdk") ||
      Build.PRODUCT.contains("google_sdk") ||
      Build.PRODUCT.contains("sdk_google") ||
      Build.PRODUCT.contains("sdk_x86") ||
      Build.PRODUCT.contains("vbox86p") ||
      Build.PRODUCT.contains("emulator") ||
      Build.PRODUCT.contains("simulator") ||
      Build.BOARD.lowercase(Locale.ROOT).contains("nox") ||
      Build.BOOTLOADER.lowercase(Locale.ROOT).contains("nox") ||
      Build.HARDWARE.lowercase(Locale.ROOT).contains("nox") ||
      Build.PRODUCT.lowercase(Locale.ROOT).contains("nox") ||
      (Build.BRAND.startsWith("generic") && Build.DEVICE.startsWith("generic"))
  }
}

@LynxNativeModule(name = "DeviceModule")
class DeviceModule(private val context: Context) : DeviceModuleSpec(context) {
  private val mContext = context

  private fun getContext(): Context {
    return mContext
  }

  override fun isDevice() = !EmulatorUtilities.isRunningOnEmulator()
  override fun brand() = Build.BRAND
  override fun manufacturer() = Build.MANUFACTURER
  override fun modelName() = Build.MODEL
  override fun designName() = Build.DEVICE
  override fun productName() = Build.PRODUCT

  private val deviceYearClass: Int
    get() = YearClass.get(context)

  override fun deviceYearClass() = deviceYearClass.toDouble()

  override fun totalMemory(): Double {
    val activityManager =
      context.getSystemService(Context.ACTIVITY_SERVICE) as android.app.ActivityManager
    val memoryInfo = android.app.ActivityManager.MemoryInfo()
    activityManager.getMemoryInfo(memoryInfo)
    return memoryInfo.totalMem.toDouble()
  }

  override fun deviceType(): Double {
    return getDeviceType(context).JSValue.toDouble()
  }

  override fun osName() = systemName
  override fun osVersion() = Build.VERSION.RELEASE
  override fun osBuildId() = Build.DISPLAY
  override fun osInternalBuildId() = Build.ID
  override fun osBuildFingerprint() = Build.FINGERPRINT

  override fun platformApiLevel() = Build.VERSION.SDK_INT.toDouble()

  override fun deviceName(): String {
    return if (Build.VERSION.SDK_INT <= 31) {
      android.provider.Settings.Secure.getString(
        context.contentResolver,
        "bluetooth_name"
      ) ?: ""
    } else {
      android.provider.Settings.Global.getString(
        context.contentResolver,
        android.provider.Settings.Global.DEVICE_NAME
      ) ?: ""
    }
  }

  private val systemName: String
    get() = Build.VERSION.BASE_OS.takeIf { it.isNotEmpty() } ?: "Android"

  private enum class DeviceType(val JSValue: Int) {
    UNKNOWN(0),
    PHONE(1),
    TABLET(2),
    DESKTOP(3),
    TV(4)
  }

  private fun getDeviceType(context: Context): DeviceType {
    if (context.applicationContext.packageManager.hasSystemFeature("amazon.hardware.fire_tv")) {
      return DeviceType.TV
    }
    val uiManager =
      context.getSystemService(Context.UI_MODE_SERVICE) as android.app.UiModeManager?
    if (uiManager != null && uiManager.currentModeType == Configuration.UI_MODE_TYPE_TELEVISION) {
      return DeviceType.TV
    }
    val fromResource = getDeviceTypeFromResourceConfiguration(context)
    return if (fromResource != DeviceType.UNKNOWN) fromResource else getDeviceTypeFromPhysicalSize(context)
  }

  private fun getDeviceTypeFromResourceConfiguration(context: Context): DeviceType {
    val smallestScreenWidthDp = context.resources.configuration.smallestScreenWidthDp
    return if (smallestScreenWidthDp == Configuration.SMALLEST_SCREEN_WIDTH_DP_UNDEFINED) {
      DeviceType.UNKNOWN
    } else if (smallestScreenWidthDp >= 600) {
      DeviceType.TABLET
    } else {
      DeviceType.PHONE
    }
  }

  private fun getDeviceTypeFromPhysicalSize(context: Context): DeviceType {
    val windowManager =
      context.getSystemService(Context.WINDOW_SERVICE) as WindowManager? ?: return DeviceType.UNKNOWN
    val widthInches: Double
    val heightInches: Double
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      val bounds = windowManager.currentWindowMetrics.bounds
      val densityDpi = context.resources.configuration.densityDpi
      widthInches = bounds.width() / densityDpi.toDouble()
      heightInches = bounds.height() / densityDpi.toDouble()
    } else {
      val metrics = android.util.DisplayMetrics()
      @Suppress("DEPRECATION")
      windowManager.defaultDisplay.getRealMetrics(metrics)
      widthInches = metrics.widthPixels / metrics.xdpi.toDouble()
      heightInches = metrics.heightPixels / metrics.ydpi.toDouble()
    }
    val diagonal = sqrt(widthInches.pow(2.0) + heightInches.pow(2.0))
    return if (diagonal in 3.0..6.9) {
      DeviceType.PHONE
    } else if (diagonal > 6.9 && diagonal <= 18.0) {
      DeviceType.TABLET
    } else {
      DeviceType.UNKNOWN
    }
  }
}
