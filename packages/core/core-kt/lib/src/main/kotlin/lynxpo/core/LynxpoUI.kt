package lynxpo.core

import android.view.View
import com.lynx.tasm.behavior.LynxContext
import com.lynx.tasm.behavior.ui.LynxUI
import com.lynx.tasm.event.LynxCustomEvent

abstract class LynxpoUI<T : View>(context: LynxContext, param: Any? = null) :
    LynxUI<T>(context, param) {
    constructor(context: LynxContext) : this(context, null)

    protected fun emitEvent(name: String) {
        val detail = LynxCustomEvent(sign, name)
        lynxContext.eventEmitter.sendCustomEvent(detail)
    }

    protected fun emitEvent(name: String, value: Map<String, Any>) {
      val detail = LynxCustomEvent(sign, name)
      value.forEach { key, v -> detail.addDetail(key, v) }
      lynxContext.eventEmitter.sendCustomEvent(detail)
   }
}

