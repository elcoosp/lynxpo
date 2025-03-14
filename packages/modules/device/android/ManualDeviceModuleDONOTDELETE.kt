package com.lynx.explorer.modules

// import dev.adamko.kxstsgen.*
import android.app.ActivityManager
import android.app.UiModeManager
import android.content.Context
import android.content.res.Configuration
import android.os.Build
import android.os.SystemClock
import android.util.DisplayMetrics
import android.view.WindowManager
import com.facebook.device.yearclass.YearClass
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import java.io.File
import kotlin.math.pow
import kotlin.math.sqrt

// import kotlinx.serialization.Serializable

class NativeDeviceModule(private val context: Context) : LynxModule(context) {

  // TODO @Serializable does not work maybe because we are inside modules
  enum class DeviceType(val value: Int) {
    UNKNOWN(0),
    PHONE(1),
    TABLET(2),
    DESKTOP(3),
    TV(4)
  }

  // Constants
  @LynxMethod
  fun isRunningOnEmulator(): Boolean {
    return Build.FINGERPRINT.startsWith("generic") ||
            Build.FINGERPRINT.startsWith("unknown") ||
            Build.MODEL.contains("google_sdk") ||
            Build.MODEL.contains("Emulator") ||
            Build.MODEL.contains("Android SDK")
  }
  @LynxMethod fun isDevice(): Boolean = !isRunningOnEmulator()

  @LynxMethod fun brand(): String? = Build.BRAND

  @LynxMethod fun manufacturer(): String? = Build.MANUFACTURER

  @LynxMethod fun modelName(): String? = Build.MODEL

  @LynxMethod fun designName(): String? = Build.DEVICE

  @LynxMethod fun productName(): String? = Build.PRODUCT

  @LynxMethod fun deviceYearClass(): Int = YearClass.get(context)

  @LynxMethod
  fun totalMemory(): Long {
    val memoryInfo = ActivityManager.MemoryInfo()
    (context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager).getMemoryInfo(
            memoryInfo
    )
    return memoryInfo.totalMem
  }

  @LynxMethod fun deviceType(): Int = getDeviceType().value

  @LynxMethod fun osName(): String = Build.VERSION.BASE_OS.ifEmpty { "Android" }

  @LynxMethod fun osVersion(): String? = Build.VERSION.RELEASE

  @LynxMethod fun platformApiLevel(): Int = Build.VERSION.SDK_INT

  // Async methods
  @LynxMethod fun getDeviceTypeAsync(): Int = getDeviceType().value

  @LynxMethod fun getUptimeAsync(): Long = SystemClock.uptimeMillis()

  @LynxMethod
  fun isRootedExperimentalAsync(): Boolean {
    return when {
      Build.TAGS?.contains("test-keys") == true -> true
      File("/system/app/Superuser.apk").exists() -> true
      else -> File("/system/xbin/su").exists()
    }
  }

  private fun getDeviceType(): DeviceType {
    if (context.packageManager.hasSystemFeature("amazon.hardware.fire_tv")) {
      return DeviceType.TV
    }

    val uiManager = context.getSystemService(Context.UI_MODE_SERVICE) as UiModeManager?
    uiManager?.let {
      if (it.currentModeType == Configuration.UI_MODE_TYPE_TELEVISION) {
        return DeviceType.TV
      }
    }

    return when (val screenWidth = context.resources.configuration.smallestScreenWidthDp) {
      Configuration.SMALLEST_SCREEN_WIDTH_DP_UNDEFINED -> getDeviceTypeFromPhysicalSize()
      in 600..Int.MAX_VALUE -> DeviceType.TABLET
      else -> DeviceType.PHONE
    }
  }

  private fun getDeviceTypeFromPhysicalSize(): DeviceType {
    val windowManager =
            context.getSystemService(Context.WINDOW_SERVICE) as WindowManager?
                    ?: return DeviceType.UNKNOWN

    return try {
      val metrics = DisplayMetrics()
      windowManager.defaultDisplay.getRealMetrics(metrics)
      val diagonalSize =
              sqrt(
                      (metrics.widthPixels / metrics.xdpi).pow(2) +
                              (metrics.heightPixels / metrics.ydpi).pow(2)
              )

      when {
        diagonalSize in 3.0..6.9 -> DeviceType.PHONE
        diagonalSize > 6.9 && diagonalSize <= 18.0 -> DeviceType.TABLET
        else -> DeviceType.UNKNOWN
      }
    } catch (e: Exception) {
      DeviceType.UNKNOWN
    }
  }
}
