import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/**/test/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      include: [
        'packages/playground/src/plugins/android-perms.ts',
        'packages/playground/src/plugins/android-perms-core.ts',
        'packages/playground/src/mods-registry.ts',
        'packages/playground/src/mods-args.ts',
        'packages/modules/device/src/index.ts',
      ],
      exclude: ['**/src/generated/**', '**/*.d.ts'],
      thresholds: {
        lines: 60,
        functions: 60,
        statements: 60,
        branches: 50,
      },
    },
  },
});
