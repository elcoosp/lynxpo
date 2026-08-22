import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';
import { defineConfig } from '@lynx-js/rspeedy';
import { pluginKotlinToTS } from '@lynxpo/plugins-ktts';
import { androidPermissionsPlugin } from './src/plugins/android-perms.ts';

export default defineConfig({
  source: {
    entry: {
      main: ['./src/index.tsx'],
      hostdemo: ['./src/host-demo.tsx'],
      hostmin: ['./src/host-min.tsx'],
      hostsingle: ['./src/host-single.tsx'],
      hostsync: ['./src/host-sync.tsx'],
      hostshowcase: ['./src/host-showcase.tsx'],
    },
  },
  server: {
    // Pinned so lynxpo never collides with the Metro/RN bundlers (8081/8082/8083)
    // or the other vite/rsbuild dev servers already holding 3000/3001.
    port: 3100,
  },
  plugins: [
    pluginQRCode({
      schema(url) {
        // `?fullscreen=true` opens the page in LynxExplorer full screen.
        // `enable_napi_addon=true` makes the iOS launcher spin up the background
        // runtime that loads the Node-API addon (defines
        // `__lynx_node_addon_exports__` and the native modules). Without it, iOS
        // renders every module value as "—" while Android (which enables the addon
        // by default) populates them. Harmless on Android.
        return `${url}?fullscreen=true&enable_napi_addon=true`;
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
