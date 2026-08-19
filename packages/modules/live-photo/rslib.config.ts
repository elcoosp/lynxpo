import { createRsLibConfig } from '@elcoosp-configs/rslib';
import { pluginKotlinToTS } from '@lynxpo/plugins-ktts';
import { defineConfig } from '@rslib/core';

export default defineConfig(async () => ({
  ...(await createRsLibConfig({ preset: 'dual', bundle: false })),
  plugins: [
    pluginKotlinToTS({
      modules: [
        { kotlinPath: './android/LivePhoto.kt', tsPath: './src/index.ts' },
      ],
    }),
  ],
}));
