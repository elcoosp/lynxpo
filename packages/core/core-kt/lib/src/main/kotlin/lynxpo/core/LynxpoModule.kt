package lynxpo.core


import android.content.Context
import com.lynx.jsbridge.LynxModule

@DslMarker
annotation class LynxpoModuleDsl

abstract class LynxpoModule(context: Context) : LynxModule(context) {
    val propDefinitions = mutableListOf<PropDefinition<*>>()
    val onCreateHandlers = mutableListOf<() -> Unit>()
    val onDestroyHandlers = mutableListOf<() -> Unit>()
    val onStartObservingHandlers = mutableListOf<() -> Unit>()
    val onStopObservingHandlers = mutableListOf<() -> Unit>()
    val activityLifecycleHandlers =
        mutableMapOf<ActivityLifecycleEvent, MutableList<() -> Unit>>()

    // Prop API - Using inline function with reified type parameter
    @LynxpoModuleDsl
    inline fun <reified T> Prop(name: String, noinline setter: (value: T) -> Unit) {
        propDefinitions.add(PropDefinition(name, setter))
    }

    // FIXME: this should be for module creation, not activity
    // Lifecycle APIs - Using inline functions with crossinline lambdas
    @LynxpoModuleDsl
    inline fun OnCreate(crossinline handler: () -> Unit) {
        onCreateHandlers.add { handler() }
    }

    @LynxpoModuleDsl
    inline fun OnDestroy(crossinline handler: () -> Unit) {
        onDestroyHandlers.add { handler() }
    }

    @LynxpoModuleDsl
    inline fun OnStartObserving(crossinline handler: () -> Unit) {
        onStartObservingHandlers.add { handler() }
    }

    @LynxpoModuleDsl
    inline fun OnStopObserving(crossinline handler: () -> Unit) {
        onStopObservingHandlers.add { handler() }
    }

    // Activity Lifecycle APIs - Using inline functions with crossinline lambdas
    @LynxpoModuleDsl
    inline fun OnActivityEntersForeground(crossinline handler: () -> Unit) {
        activityLifecycleHandlers
            .getOrPut(ActivityLifecycleEvent.ENTERS_FOREGROUND) { mutableListOf() }
            .add { handler() }
    }

    @LynxpoModuleDsl
    inline fun OnActivityEntersBackground(crossinline handler: () -> Unit) {
        activityLifecycleHandlers
            .getOrPut(ActivityLifecycleEvent.ENTERS_BACKGROUND) { mutableListOf() }
            .add { handler() }
    }

    @LynxpoModuleDsl
    inline fun OnActivityDestroys(crossinline handler: () -> Unit) {
        activityLifecycleHandlers
            .getOrPut(ActivityLifecycleEvent.DESTROYS) { mutableListOf() }
            .add { handler() }
    }

    inner class PropDefinition<T>(val name: String, val setter: (T) -> Unit)

    enum class ActivityLifecycleEvent {
        CREATE,
        ENTERS_FOREGROUND,
        ENTERS_BACKGROUND,
        DESTROYS
    }
}