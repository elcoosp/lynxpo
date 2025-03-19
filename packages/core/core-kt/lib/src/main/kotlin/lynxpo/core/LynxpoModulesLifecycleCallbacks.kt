package lynxpo.core

import android.app.Activity
import android.app.Application.ActivityLifecycleCallbacks
import android.os.Bundle
import com.lynx.jsbridge.LynxModuleWrapper
import com.lynx.tasm.LynxEnv

class LynxpoModulesLifecycleCallbacks(val moduleNames: Array<String>) :
    ActivityLifecycleCallbacks {
    fun getMods(): Array<LynxModuleWrapper> {
        val moduleFactory = LynxEnv.inst().moduleFactory
        val mods = moduleNames.map { it -> moduleFactory.getModule(it) }
        return mods.toTypedArray()
    }

    private fun notifyLifecycleEvent(
        lifecycleEvent: LynxpoModule.ActivityLifecycleEvent,
        activity: Activity
    ) {
        getMods().forEach { moduleWrapper ->
            {
                val mod =
                    (moduleWrapper.module as? LynxpoModule)
                mod?.activityLifecycleHandlers
                    ?.get(lifecycleEvent)
                    ?.forEach { it() }
            }
        }
    }

    override fun onActivityPaused(activity: Activity) {
        notifyLifecycleEvent(LynxpoModule.ActivityLifecycleEvent.ENTERS_BACKGROUND, activity)
    }

    override fun onActivityResumed(activity: Activity) {
        notifyLifecycleEvent(LynxpoModule.ActivityLifecycleEvent.ENTERS_FOREGROUND, activity)

    }

    override fun onActivityDestroyed(activity: Activity) {
        notifyLifecycleEvent(LynxpoModule.ActivityLifecycleEvent.DESTROYS, activity)

    }

    // Unused callbacks
    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {}

    override fun onActivityStarted(activity: Activity) {}

    override fun onActivityStopped(activity: Activity) {}

    override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {}
}
