package lynxpo.core

import android.app.Application
import android.view.View
import com.facebook.drawee.backends.pipeline.Fresco
import com.facebook.imagepipeline.core.ImagePipelineConfig
import com.facebook.imagepipeline.memory.PoolConfig
import com.facebook.imagepipeline.memory.PoolFactory
import com.lynx.service.http.LynxHttpService
import com.lynx.service.image.LynxImageService
import com.lynx.service.log.LynxLogService
import com.lynx.tasm.LynxEnv
import com.lynx.tasm.behavior.Behavior
import com.lynx.tasm.behavior.LynxContext
import com.lynx.tasm.service.LynxServiceCenter


abstract class LynxpoApp : Application() {
    abstract val lynxpoModules: Array<Pair<String, Class<out LynxpoModule>>>
    abstract val lynxpoUiModules: Array<Pair<String, Class<out LynxpoUI<out View>>>>
    override fun onCreate() {
        super.onCreate()
        initLynxService()
        initLynxEnv()
    }

    /** Can only be called after initLynxpoModules */
    private fun initLifecycleRegistration() {
        registerActivityLifecycleCallbacks(LynxpoModulesLifecycleCallbacks(lynxpoModules.map { it -> it.first }
            .toTypedArray()))
    }

    /** Should be called directly after super.onCreate() */
    private fun initLynxService() {
        // Init Fresco which is needed by LynxImageService
        val factory = PoolFactory(PoolConfig.newBuilder().build())
        val builder = ImagePipelineConfig.newBuilder(applicationContext).setPoolFactory(factory)
        Fresco.initialize(applicationContext, builder.build())

        LynxServiceCenter.inst().registerService(LynxImageService.getInstance())
        LynxServiceCenter.inst().registerService(LynxLogService)
        LynxServiceCenter.inst().registerService(LynxHttpService)
    }

    /** Can only be called after LynxEnv.inst().init(...) */
    private fun initLynxpoModules() {
        lynxpoModules.forEach { it ->
            val (name, module) = it
            LynxEnv.inst().registerModule(name, module)
        }.run { }
    }

    private fun initLynxpoGlobalUiModules() {
        lynxpoUiModules.forEach { it ->
            val (name, uiModuleClass) = it
            LynxEnv.inst().addBehavior(object : Behavior(name) {
                override fun createUI(context: LynxContext): LynxpoUI<out View> {
                    return uiModuleClass.getConstructor(LynxContext::class.java).newInstance(context)
                }
            })
        }.run { }
    }

    /** Can only be called after initLynxService(...) */
    private fun initLynxEnv() {
        LynxEnv.inst().init(this, null, LynxpoTemplateProvider(applicationContext), null)
        initLynxpoModules()
        initLynxpoGlobalUiModules()
        initLifecycleRegistration()
    }

    override fun onTerminate() {
        // LynxEnv.inst().notifyAppContextDestroys()
        super.onTerminate()
    }

}
