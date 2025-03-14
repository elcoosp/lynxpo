// TODO add package
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import com.lynx.jsbridge.Promise
import com.lynx.tasm.behavior.LynxContext


import android.app.ActivityManager
import android.app.UiModeManager
import android.content.Context
import android.content.res.Configuration
import android.os.Build
import android.os.SystemClock
import android.provider.Settings
import android.util.DisplayMetrics
import android.view.WindowManager
import com.facebook.device.yearclass.YearClass
import expo.modules.core.utilities.EmulatorUtilities



import java.io.File
import kotlin.math.pow
import kotlin.math.sqrt

class DeviceModule(private val context: Context) : LynxModule(context) {
  // Keep this enum in sync with JavaScript
  enum class DeviceType(val JSValue: Int) {
    UNKNOWN(0),
    PHONE(1),
    TABLET(2),
    DESKTOP(3),
    TV(4)
  }

  private fun getContext(): Context {
    val lynxContext = mContext as LynxContext
    return lynxContext.getContext()
  }
  
    

  @LynxMethod
  fun isDevice() = !isRunningOnEmulator
  @LynxMethod
  fun brand() = Build.BRAND
  @LynxMethod
  fun manufacturer() = Build.MANUFACTURER
  @LynxMethod
  fun modelName() = Build.MODEL
  @LynxMethod
  fun designName() = Build.DEVICE
  @LynxMethod
  fun productName() = Build.PRODUCT
  @LynxMethod
  fun deviceYearClass() = deviceYearClass
  @LynxMethod
  fun totalMemory() = run {
    val memoryInfo = ActivityManager.MemoryInfo()
    (context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager).getMemoryInfo(memoryInfo)
    memoryInfo.totalMem
  }
  @LynxMethod
  fun deviceType() = run {
    getDeviceType(context).JSValue
  }
  @LynxMethod
  fun supportedCpuArchitectures() = Build.SUPPORTED_ABIS?.takeIf { it.isNotEmpty() }
  @LynxMethod
  fun osName() = systemName
  @LynxMethod
  fun osVersion() = Build.VERSION.RELEASE
  @LynxMethod
  fun osBuildId() = Build.DISPLAY
  @LynxMethod
  fun osInternalBuildId() = Build.ID
  @LynxMethod
  fun osBuildFingerprint() = Build.FINGERPRINT
  @LynxMethod
  fun platformApiLevel() = Build.VERSION.SDK_INT
  @LynxMethod
  fun deviceName() = if (Build.VERSION.SDK_INT <= 31) {
    Settings.Secure.getString(context.contentResolver, "bluetooth_name")
  } else {
    Settings.Global.getString(context.contentResolver, Settings.Global.DEVICE_NAME)
  }
  
  

  private val deviceYearClass: Int
    get() = YearClass.get(context)

  private val systemName: String
    get() {
      return Build.VERSION.BASE_OS.takeIf { it.isNotEmpty() } ?: "Android"
    }

  companion object {
    private val isRunningOnEmulator: Boolean
      get() = EmulatorUtilities.isRunningOnEmulator()

    private fun getDeviceType(context: Context): DeviceType {
      // Detect TVs via UI mode (Android TVs) or system features (Fire TV).
      if (context.applicationContext.packageManager.hasSystemFeature("amazon.hardware.fire_tv")) {
        return DeviceType.TV
      }

      val uiManager = context.getSystemService(Context.UI_MODE_SERVICE) as UiModeManager?
      if (uiManager != null && uiManager.currentModeType == Configuration.UI_MODE_TYPE_TELEVISION) {
        return DeviceType.TV
      }

      val deviceTypeFromResourceConfiguration = getDeviceTypeFromResourceConfiguration(context)
      return if (deviceTypeFromResourceConfiguration != DeviceType.UNKNOWN) {
        deviceTypeFromResourceConfiguration
      } else {
        getDeviceTypeFromPhysicalSize(context)
      }
    }

    // Device type based on the smallest screen width quantifier
    // https://developer.android.com/guide/topics/resources/providing-resources#SmallestScreenWidthQualifier
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
      // Find the current window manager, if none is found we can't measure the device physical size.
      val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager?
        ?: return DeviceType.UNKNOWN

      // Get display metrics to see if we can differentiate phones and tablets.
      val widthInches: Double
      val heightInches: Double

      // windowManager.defaultDisplay was marked as deprecated in API level 30 (Android R) and above
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        val windowBounds = windowManager.currentWindowMetrics.bounds
        val densityDpi = context.resources.configuration.densityDpi
        widthInches = windowBounds.width() / densityDpi.toDouble()
        heightInches = windowBounds.height() / densityDpi.toDouble()
      } else {
        val metrics = DisplayMetrics()
        @Suppress("DEPRECATION")
        windowManager.defaultDisplay.getRealMetrics(metrics)
        widthInches = metrics.widthPixels / metrics.xdpi.toDouble()
        heightInches = metrics.heightPixels / metrics.ydpi.toDouble()
      }

      // Calculate physical size.
      val diagonalSizeInches = sqrt(widthInches.pow(2.0) + heightInches.pow(2.0))

      return if (diagonalSizeInches in 3.0..6.9) {
        // Devices in a sane range for phones are considered to be phones.
        DeviceType.PHONE
      } else if (diagonalSizeInches > 6.9 && diagonalSizeInches <= 18.0) {
        // Devices larger than a phone and in a sane range for tablets are tablets.
        DeviceType.TABLET
      } else {
        // Otherwise, we don't know what device type we're on.
        DeviceType.UNKNOWN
      }
    }
  }
}
