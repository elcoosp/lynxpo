import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';
import { defineConfig } from '@lynx-js/rspeedy';
import { pluginKotlinToTS } from '@lynxpo/plugins-ktts';
import { androidPermissionsPlugin } from './src/plugins/android-perms.ts';

export default defineConfig({
  source: {
    entry: {
      main: ['./src/index.tsx'],
    },
  },
  plugins: [
    pluginQRCode({
      schema(url) {
        // We use `?fullscreen=true` to open the page in LynxExplorer in full screen mode
        return `${url}?fullscreen=true`;
      },
    }),
    androidPermissionsPlugin(),
    pluginReactLynx(),
    pluginKotlinToTS({
      hookStrategy: 'function-wrapper',
      modules: [
        {
          kotlinPath:
            './src/lynx/platform/android/lynx_xelement/lynx_xelement_scroll_coordinator/src/main/java/com/lynx/xelement/scroll/coordinator/ScrollCoordinatorLayout.kt',
          tsPath: './src/mods/permissions.ts',
        },
      ],
    }),
  ],
});
