package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import com.lynx.tasm.behavior.LynxContext

import android.content.Context
import android.content.pm.PackageManager
import java.io.File

class EnvInfoModule(private val context: Context) : LynxModule(context) {

  private fun getContext(): Context {
    val lynxContext = mContext as LynxContext
    return lynxContext.getContext()
  }

  @LynxMethod
  fun isRunningOnDevice(): Boolean {
    return !isRunningOnEmulator()
  }

  @LynxMethod
  fun installTime(): Long {
    val pkgManager = getContext().packageManager
    return try {
      val pkgInfo = pkgManager.getPackageInfo(getContext().packageName, 0)
      val sourceDir = pkgInfo.applicationInfo?.sourceDir
      if (sourceDir != null) {
        File(sourceDir).lastModified()
      } else {
        0L
      }
    } catch (e: PackageManager.NameNotFoundException) {
      0L
    }
  }

  @LynxMethod
  fun envInfo(): Map<String, Any?> {
    val ctx = getContext()
    val pm = ctx.packageManager
    val pkgInfo = try {
      pm.getPackageInfo(ctx.packageName, 0)
    } catch (e: PackageManager.NameNotFoundException) {
      null
    }
    return mapOf(
      "isRunningOnDevice" to isRunningOnDevice(),
      "installTime" to installTime(),
      "osName" to "Android",
      "osVersion" to (pkgInfo?.let { android.os.Build.VERSION.RELEASE } ?: ""),
      "appVersion" to (pkgInfo?.versionName ?: ""),
      "appId" to ctx.packageName,
    )
  }

  private fun isRunningOnEmulator(): Boolean {
    return android.os.Build.FINGERPRINT.startsWith("generic") ||
      android.os.Build.FINGERPRINT.startsWith("unknown") ||
      android.os.Build.MODEL.contains("sdk") ||
      android.os.Build.MODEL.contains("Emulator") ||
      android.os.Build.MODEL.contains("Android SDK built for x86") ||
      android.os.Build.MANUFACTURER.contains("Genymotion") ||
      android.os.Build.HARDWARE.contains("goldfish") ||
      android.os.Build.HARDWARE.contains("ranchu") ||
      android.os.Build.PRODUCT.contains("sdk") ||
      android.os.Build.PRODUCT.contains("emulator") ||
      (android.os.Build.BRAND.startsWith("generic") &&
        android.os.Build.DEVICE.startsWith("generic"))
  }
}
