// FIXME: inject real package name 
package com.{{org}}.{{project_name|camel_case}}.modules.haptics


import com.lynx.jsbridge.LynxMethod
import com.lynx.react.bridge.Callback
import com.lynx.tasm.behavior.LynxContext
import kotlinx.coroutines.*
import lynxpo.core.LynxpoModule
import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import expo.modules.haptics.arguments.HapticsImpactType
import expo.modules.haptics.arguments.HapticsNotificationType
import expo.modules.haptics.arguments.HapticsSelectionType
import expo.modules.haptics.arguments.HapticsVibrationType
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition


class HapticsModule(private val context: Context) : LynxpoModule(context) {
  private fun getContext(): Context {
    val lynxContext = mContext as LynxContext
    return lynxContext.getContext()
  }
  
      
  private val vibrator: Vibrator
      get() =
              if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                  (context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager)
                          .defaultVibrator
              } else {
                  @Suppress("DEPRECATION")
                  context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
              }

  override fun definition() = ModuleDefinition {
      

      @LynxMethod
      fun notificationAsync(type: String, callback: Callback) {
        vibrate(HapticsNotificationType.fromString(type))
      }
      

      @LynxMethod
      fun selectionAsync(callback: Callback): Unit {
        vibrate(HapticsSelectionType)
      }
      

      @LynxMethod
      fun impactAsync(style: String, callback: Callback) {
        vibrate(HapticsImpactType.fromString(style))
      }
      
  }

  private fun vibrate(type: HapticsVibrationType) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          vibrator.vibrate(VibrationEffect.createWaveform(type.timings, type.amplitudes, -1))
      } else {
          @Suppress("DEPRECATION") vibrator.vibrate(type.oldSDKPattern, -1)
      }
  }
}

