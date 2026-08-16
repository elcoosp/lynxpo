import { resolve } from 'node:path';
import { detectEnv } from '../env.js';
import { engineRoot, resolveRepoRoot, run } from '../exec.js';

/**
 * Build LynxExplorer for the booted iOS simulator, install, launch, and
 * screenshot. Mirrors the verified manual recipe.
 */
export async function dxIos(): Promise<void> {
  const env = await detectEnv();
  if (!env.xcodePresent) {
    throw new Error('xcodebuild not found — install Xcode 26.4.');
  }
  if (!env.bootedSim) {
    throw new Error(
      'No booted iOS simulator. Boot one (e.g. iPhone 17 Pro) and retry.',
    );
  }

  const iosDir = resolve(env.engineRoot, 'explorer/darwin/ios/lynx_explorer');
  console.log('ios: bundle_install (pods)…');
  // Run via a login shell so the nested engine repo's pinned pnpm (7.33.6,
  // via corepack) is used instead of any other pnpm first on PATH.
  await run('bash', ['-lc', './bundle_install.sh'], { cwd: iosDir });

  console.log('ios: xcodebuild LynxExplorer (Debug, iphonesimulator)…');
  await run(
    'xcodebuild',
    [
      '-workspace',
      'LynxExplorer.xcworkspace',
      '-scheme',
      'LynxExplorer',
      '-configuration',
      'Debug',
      '-sdk',
      'iphonesimulator',
      '-destination',
      `id=${env.bootedSim}`,
      '-derivedDataPath',
      './build',
      'build',
      'ARCHS=arm64',
      'ONLY_ACTIVE_ARCH=YES',
    ],
    { cwd: iosDir },
  );

  const app = resolve(
    iosDir,
    'build/Build/Products/Debug-iphonesimulator/LynxExplorer.app',
  );
  console.log('ios: install…');
  await run('xcrun', ['simctl', 'install', env.bootedSim, app]);

  // A freshly-installed app isn't immediately launchable; SpringBoard needs a
  // moment to register it. Retry the launch a few times with a short delay
  // (avoids the FBSOpenApplicationServiceErrorDomain code=4 race).
  // NOTE: the explorer's bundle id is com.lynx.LynxExplorer (not com.lynx.explorer).
  const bundleId = 'com.lynx.LynxExplorer';
  console.log(`ios: launch ${bundleId}…`);
  let launched = false;
  for (let attempt = 1; attempt <= 5 && !launched; attempt++) {
    try {
      await run('xcrun', ['simctl', 'launch', env.bootedSim, bundleId]);
      launched = true;
    } catch {
      if (attempt < 5) {
        console.log(`ios: launch attempt ${attempt} failed, retrying…`);
        await new Promise((r) => setTimeout(r, 2000));
      } else {
        throw new Error(`ios: failed to launch ${bundleId} after retries`);
      }
    }
  }

  const shot = '/tmp/lynxpo-ios.png';
  // Give SpringBoard a moment to bring the app to the foreground before
  // capturing, otherwise the screenshot lands on the app switcher / previous screen.
  console.log('ios: waiting for foreground…');
  await new Promise((r) => setTimeout(r, 6000));
  await run('xcrun', ['simctl', 'io', env.bootedSim, 'screenshot', shot]);
  console.log(`ios: screenshot -> ${shot}`);
}
