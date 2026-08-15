package lynxpo.core.modules.statusbar

import android.content.Context
import androidx.core.content.ContextCompat
import com.lynx.jsbridge.LynxMethod
import lynxpo.core.ActivityAwareLynxpoModule

/**
 * Status bar manipulation, use api compat https://github.com/IODevBlue/StatusBarColors Should
 * migrate to use
 * https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets
 */
class StatusBarModule(private val context: Context) : ActivityAwareLynxpoModule(context) {
    @LynxMethod
    fun setColor(colorResId: Int) {
        withActivity { activity ->
            StatusBarColors.setStatusBarColor(activity, ContextCompat.getColor(context, colorResId))
        }
    }
}
