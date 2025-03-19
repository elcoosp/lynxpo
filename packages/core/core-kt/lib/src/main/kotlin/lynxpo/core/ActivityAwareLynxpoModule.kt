package lynxpo.core

import android.app.Activity
import android.content.Context
import java.lang.ref.WeakReference

/**
 * Interface to be implemented by modules that need access to the current activity
 */
interface ActivityAware {
    fun <T>withActivity(block: (Activity) -> T) 
}

/**
 * Extension of LynxpoModule that optionally provides access to the current activity
 */
abstract class ActivityAwareLynxpoModule(context: Context) : LynxpoModule(context), ActivityAware {
    
    /**
     * Execute a block of code if an activity is available
     * @param block The code to execute with the activity
     */
    override fun <T>withActivity(block: (Activity) -> T) {
        LynxpoActivityManager.getCurrentActivity()?.let { it ->
            block(it)
        }
    }
}