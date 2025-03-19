package lynxpo.core.modules.statusbar

import android.content.Context
import androidx.core.content.ContextCompat
import com.lynx.jsbridge.LynxMethod
import lynxpo.core.ActivityAwareLynxpoModule
import lynxpo.core.R
import lynxpo.ktts.annotations.Typed

/** Status bar manipulation, use api compat https://github.com/IODevBlue/StatusBarColors
 *  Should migrate to use https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/WindowInsets */
@Typed
class StatusBarModule(private val context: Context) : ActivityAwareLynxpoModule(context) {
    @LynxMethod
    fun setColor() {
        withActivity { activity ->
            val blueColor = ContextCompat.getColor(context, R.color.teal_200)
            StatusBarColors.setStatusBarColor(activity, blueColor)
        }
    }

}
