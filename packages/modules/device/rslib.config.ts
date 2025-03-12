import { createRsLibConfig } from '@elcoosp-configs/rslib';
import { defineConfig } from '@rslib/core';
import { pluginKotlinToTS } from '@lynxpo/plugins-ktts'

export default defineConfig(async () => ({
    ...(await createRsLibConfig({ preset: 'dual', bundle: false })),
    plugins: [
        pluginKotlinToTS({
            modules: [{
                kotlinPath: './android/NativeDeviceModule.kt',
                tsPath: './src/index.ts',
            }]
        })
    ]
}));
