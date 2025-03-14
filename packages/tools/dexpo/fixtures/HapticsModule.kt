// TODO add package
import com.lynx.jsbridge.LynxMethod
import com.lynx.jsbridge.LynxModule


import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager








class HapticsModule(private val context: Context) : LynxModule(context) {
  
      
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
      fun notificationAsync(type: String, promise: Promise) {
        vibrate(HapticsNotificationType.fromString(type))
      }
      

      @LynxMethod
      fun selectionAsync(promise: Promise): Unit {
        vibrate(HapticsSelectionType)
      }
      

      @LynxMethod
      fun impactAsync(style: String, promise: Promise) {
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

