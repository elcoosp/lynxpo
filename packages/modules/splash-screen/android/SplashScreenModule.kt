package com.lynx.explorer.modules

import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule
import com.lynx.tasm.behavior.LynxContext

import android.content.Context

class SplashScreenModule(private val context: Context) : LynxModule(context) {

  @LynxMethod
  fun hideAsync(): String {
    // No native splash to control in the Explorer; already hidden.
    return "hidden"
  }

  @LynxMethod
  fun preventAutoHideAsync(): String? {
    return null
  }

  @LynxMethod
  fun statusAsync(): String {
    // Splash is hidden once the Lynx surface is mounted.
    return "hidden"
  }
}
