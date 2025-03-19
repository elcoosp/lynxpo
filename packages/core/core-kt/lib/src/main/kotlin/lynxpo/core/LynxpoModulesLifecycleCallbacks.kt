package lynxpo.core

import android.app.Activity
import android.app.Application.ActivityLifecycleCallbacks
import android.os.Bundle
import com.lynx.jsbridge.LynxModuleWrapper
import com.lynx.tasm.LynxEnv

/**
 * Lifecycle callbacks that update the ActivityManager and notify modules of lifecycle events
 */
class LynxpoModulesLifecycleCallbacks(val moduleNames: Array<String>) :
    ActivityLifecycleCallbacks {
    
    /**
     * Get module wrappers safely from the module factory
     */
    private fun getModuleWrappers(): List<LynxModuleWrapper> {
        val moduleFactory = LynxEnv.inst().moduleFactory
        return moduleNames.mapNotNull { name ->
            moduleFactory.getModule(name)
        }
    }
    
    /**
     * Notify modules about lifecycle events
     */
    private fun notifyLifecycleEvent(
        lifecycleEvent: LynxpoModule.ActivityLifecycleEvent,
        activity: Activity
    ) {
        // Update activity in manager for FOREGROUND events only
        if (lifecycleEvent == LynxpoModule.ActivityLifecycleEvent.ENTERS_FOREGROUND) {
            LynxpoActivityManager.setCurrentActivity(activity)
        }
        
        // Notify lifecycle handlers in modules
        getModuleWrappers().forEach { moduleWrapper ->
            val module = moduleWrapper.module
            if (module is LynxpoModule) {
                module.activityLifecycleHandlers
                    .get(lifecycleEvent)
                    ?.forEach { it() }.run {}
            }
        }
    }
    
    override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
        // No specific action needed
    }

    override fun onActivityStarted(activity: Activity) {
        // Set as current activity
        LynxpoActivityManager.setCurrentActivity(activity)
    }

    override fun onActivityResumed(activity: Activity) {
        notifyLifecycleEvent(LynxpoModule.ActivityLifecycleEvent.ENTERS_FOREGROUND, activity)
    }

    override fun onActivityPaused(activity: Activity) {
        notifyLifecycleEvent(LynxpoModule.ActivityLifecycleEvent.ENTERS_BACKGROUND, activity)
    }

    override fun onActivityStopped(activity: Activity) {
        // No specific action needed
    }

    override fun onActivityDestroyed(activity: Activity) {
        notifyLifecycleEvent(LynxpoModule.ActivityLifecycleEvent.DESTROYS, activity)
        LynxpoActivityManager.onActivityDestroyed(activity)
    }

    override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) {
        // No specific action needed
    }
}