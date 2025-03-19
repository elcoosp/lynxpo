package lynxpo.core.modules.statusbar

import android.app.Activity
import android.content.Context
import androidx.core.content.ContextCompat
import com.lynx.jsbridge.LynxMethod
import lynxpo.core.R
import lynxpo.ktts.annotations.Typed
import lynxpo.core.ActivityAwareLynxpoModule
import lynxpo.core.LynxpoActivityManager

/** Status bar manipulation, use api compat https://github.com/facebook/react-native/blob/adbcaef1e1632eff29570cce878b65594096a694/packages/react-native/Libraries/Components/StatusBar/StatusBar.d.ts#L72 */
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
