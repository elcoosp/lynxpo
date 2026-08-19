// Copyright 2026 The Lynxpo Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { createRsLibConfig } from '@elcoosp-configs/rslib';
import { pluginKotlinToTS } from '@lynxpo/plugins-ktts';
import { defineConfig } from '@rslib/core';

export default defineConfig(async () => ({
  ...(await createRsLibConfig({ preset: 'dual', bundle: false })),
  plugins: [
    pluginKotlinToTS({
      modules: [
        {
          kotlinPath: './android/IntentLauncher.kt',
          tsPath: './src/index.ts',
        },
      ],
    }),
  ],
}));
