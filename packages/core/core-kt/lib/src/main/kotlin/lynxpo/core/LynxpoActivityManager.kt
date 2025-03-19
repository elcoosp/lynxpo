package lynxpo.core

import android.app.Activity
import java.lang.ref.WeakReference

/**
 * Singleton manager for handling activity references to modules
 */
object LynxpoActivityManager {
    private var currentActivityRef: WeakReference<Activity>? = null

    /**
     * Set the current activity
     */
    fun setCurrentActivity(activity: Activity?) {
        currentActivityRef = activity?.let { WeakReference(it) }
    }

    /**
     * Get the current activity, if available
     */
    fun getCurrentActivity(): Activity? {
        return currentActivityRef?.get()
    }


    /**
     * Clear activity reference when the activity is destroyed
     */
    fun onActivityDestroyed(activity: Activity) {
        if (currentActivityRef?.get() == activity) {
            currentActivityRef = null
        }
    }
}