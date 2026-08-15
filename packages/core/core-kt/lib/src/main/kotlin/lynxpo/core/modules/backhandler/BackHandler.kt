package lynxpo.core.modules.backhandler

import android.content.Context
import com.lynx.jsbridge.LynxMethod
import lynxpo.core.LynxpoModule

class BackHandlerModule(private val context: Context) : LynxpoModule(context) {
    init {}
    @LynxMethod fun test() = 0
}
