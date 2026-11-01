import { createRsLibConfig } from '@elcoosp-configs/rslib';
import { defineConfig } from '@rslib/core';

export default defineConfig(async () => ({
  ...(await createRsLibConfig({ preset: 'dual', bundle: false })),
}));
