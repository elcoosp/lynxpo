package com.lynx.explorer.modules

import android.content.Context
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.os.Build
import android.provider.Settings
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule

/**
 * Android source-of-truth for the `@lynxpo/mods-application` package. The ktts
 * plugin reads this file and generates `src/index.ts` (the `getX`/`useX`
 * accessors). Method names mirror Expo's `expo-application` (v57) native module
 * surface, reusing its implementation logic. The runtime twin of this module
 * lives in the Lynx Explorer as `ApplicationModule` (registered via nmi).
 */
class ApplicationModule(private val context: Context) : LynxModule(context) {
  @LynxMethod
  fun applicationName() = run {
    context.packageManager
      .getApplicationLabel(context.applicationInfo)
      .toString()
  }

  @LynxMethod
  fun applicationId() = context.packageName

  @LynxMethod
  fun nativeApplicationVersion() = run {
    getPackageInfo().versionName ?: ""
  }

  @LynxMethod
  fun nativeBuildVersion() = getLongVersionCode(getPackageInfo()).toString()

  @LynxMethod
  fun androidId() =
    Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)

  @LynxMethod
  fun getInstallationTime() = getPackageInfo().firstInstallTime.toDouble()

  @LynxMethod
  fun getLastUpdateTime() = getPackageInfo().lastUpdateTime.toDouble()

  private fun getPackageInfo(): PackageInfo =
    context.packageManager.getPackageInfo(context.packageName, 0)

  private fun getLongVersionCode(info: PackageInfo): Long =
    if (Build.VERSION.SDK_INT >= 28) info.longVersionCode else info.versionCode.toLong()
}
