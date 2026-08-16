import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { detectEnv, isJava11 } from '../env.js';
import { engineRoot, resolveRepoRoot, run } from '../exec.js';

const DEFAULT_PORT = 8137;
const DEFAULT_AVD = 'Medium_Phone_API_36.1';

/** Return the serial of a connected physical (USB) device, or null. */
async function detectDevice(env: {
  androidHome: string | null;
}): Promise<string | null> {
  try {
    const res = await run('adb', ['devices', '-l'], {
      inherit: false,
      throwOnError: false,
      env: adbEnv(env),
    });
    for (const line of res.stdout.split('\n')) {
      const m = line.match(/^(\S+)\s+device\s+(?!.*\bemulator\b).*\busb:/);
      if (m) return m[1];
    }
  } catch {
    /* no device */
  }
  return null;
}

/**
 * Build LynxExplorer (Android), serve the playground bundle, launch the
 * emulator (windowed so it's visible), install, launch with the bundle, and
 * screenshot. Mirrors the verified manual recipe.
 */
export async function dxAndroid(
  opts: { port?: number; avd?: string; headless?: boolean } = {},
): Promise<void> {
  const env = await detectEnv();
  if (!env.androidHome || !env.androidSdkPresent) {
    throw new Error(
      'ANDROID_HOME not set or SDK missing (platform-tools/adb).',
    );
  }

  // Android gradle requires Java 11, not the system's Java 21.
  const javaHome = process.env.JAVA_HOME ?? env.javaHome ?? '';
  if (!isJava11(env.javaVersion) && !javaHome.includes('jdk11')) {
    throw new Error(
      'Android build needs Java 11 (JAVA_HOME=~/jdk11/Contents/Home). ' +
        `Current java: ${env.javaVersion ?? 'none'}.`,
    );
  }

  const androidDir = resolve(env.engineRoot, 'explorer/android');
  // Build only the flavor we actually install (withoutSparklingNoasan) to keep
  // the native build's disk footprint small (each variant ships a ~500MB debug
  // .so; building all of them blows past available disk on this machine).
  console.log('android: gradle assembleWithoutSparklingNoasanDebug (Java 11)…');
  await run(
    './gradlew',
    [':LynxExplorer:assembleWithoutSparklingNoasanDebug', '--no-daemon'],
    {
      cwd: androidDir,
      env: { JAVA_HOME: javaHome, PATH: `${javaHome}/bin:${process.env.PATH}` },
    },
  );

  // Prefer a connected physical device (instant, no slow emulator boot).
  // Fall back to the emulator only when no device is attached.
  const device = await detectDevice(env);
  let target: { serial?: string; bundleHost: string };
  if (device) {
    console.log(`android: using physical device ${device}…`);
    // The phone reaches the Mac over a USB adb-reverse tunnel (localhost),
    // not the LAN — the phone often can't route to the Mac's LAN IP.
    await run(
      'adb',
      ['-s', device, 'reverse', `tcp:${DEFAULT_PORT}`, `tcp:${DEFAULT_PORT}`],
      {
        inherit: false,
        throwOnError: false,
        env: adbEnv(env),
      },
    );
    target = { serial: device, bundleHost: 'localhost' };
  } else {
    const avd = opts.avd ?? DEFAULT_AVD;
    if (!(await isEmulatorReady(env))) {
      await killEmulators(env);
      console.log(`android: launching emulator ${avd}…`);
      const emuArgs = ['-avd', avd, '-no-audio'];
      if (opts.headless) emuArgs.push('-no-window');
      const emu = spawn(
        resolve(env.androidHome, 'emulator/emulator'),
        emuArgs,
        {
          stdio: 'ignore',
          detached: true,
        },
      );
      emu.unref();
      await waitForEmulator();
    } else {
      console.log('android: reusing online emulator…');
    }
    // The emulator reaches the host via the standard 10.0.2.2 alias.
    target = { bundleHost: '10.0.2.2' };
  }

  const port = opts.port ?? DEFAULT_PORT;
  const server = spawn('python3', ['-m', 'http.server', String(port)], {
    cwd: resolveRepoRoot() + '/packages/playground/dist',
    stdio: 'ignore',
  });
  server.unref();
  // Give the bundle HTTP server a moment to bind before the app fetches from it.
  await new Promise((r) => setTimeout(r, 2000));

  const apk = resolve(
    androidDir,
    'lynx_explorer/build/outputs/apk/withoutSparklingNoasan/debug/LynxExplorer-withoutSparkling-noasan-debug.apk',
  );
  console.log('android: install + launch…');
  // Retry install — a freshly-booted emulator may briefly reject with
  // "Can't find service: package" even after get-state reports `device`.
  const adb = (...args: string[]) =>
    target.serial ? ['-s', target.serial, ...args] : args;
  let installed = false;
  for (let attempt = 1; attempt <= 3 && !installed; attempt++) {
    try {
      await run('adb', adb('install', '-r', apk), { env: adbEnv(env) });
      installed = true;
    } catch {
      if (attempt < 3) {
        console.log(`android: install attempt ${attempt} failed, retrying…`);
        await new Promise((r) => setTimeout(r, 3000));
      } else {
        throw new Error('android: failed to install APK after retries');
      }
    }
  }
  // Clean slate so a repeated run always reloads the bundle (not a stale task).
  await run('adb', adb('shell', 'am', 'force-stop', 'com.lynx.explorer'), {
    env: adbEnv(env),
  });
  // Keep the display awake for the capture (battery/USB power) so the device
  // doesn't sleep and surface the lock screen over the app mid-run.
  await run('adb', adb('shell', 'svc', 'power', 'stayon', 'true'), {
    env: adbEnv(env),
    inherit: false,
    throwOnError: false,
  });
  await run(
    'adb',
    adb(
      'shell',
      'am',
      'start',
      '-S',
      '-n',
      'com.lynx.explorer/.LynxViewShellActivity',
      '-e',
      'url',
      `http://${target.bundleHost}:${port}/main.lynx.bundle`,
    ),
    { env: adbEnv(env) },
  );
  // Wait until the LynxExplorer app process is actually running, then give the
  // bundle a fixed time to render before capturing. (Polling `dumpsys` for
  // topResumedActivity is brittle across device OEMs; checking the process is
  // alive + a render delay is what reliably produces a non-blank shot.)
  const shot = '/tmp/lynxpo-android.png';
  const shell = process.platform === 'win32' ? 'cmd' : 'sh';
  const shellArg = process.platform === 'win32' ? '/c' : '-c';
  const redirect = process.platform === 'win32' ? `> "${shot}"` : `> "${shot}"`;
  console.log('android: waiting for app process + render…');
  let processAlive = false;
  for (let i = 0; i < 30; i++) {
    try {
      const p = await run('adb', adb('shell', 'pidof', 'com.lynx.explorer'), {
        inherit: false,
        throwOnError: false,
        env: adbEnv(env),
      });
      if (p.stdout.trim().length > 0) {
        processAlive = true;
        break;
      }
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  if (!processAlive) {
    console.warn('android: app process not detected; capturing anyway…');
  }
  // On MIUI/OEM launchers a single `am start -S` can leave the home screen or a
  // pulled-down notification shade on top of the app at capture time. Bring the
  // activity to the foreground a second time (without -S, which delivers to the
  // running top-most instance) and collapse any notification shade so the app
  // is guaranteed to be the visible window before we screencap.
  await run('adb', adb('shell', 'cmd', 'statusbar', 'collapse'), {
    env: adbEnv(env),
    inherit: false,
    throwOnError: false,
  });
  await run(
    'adb',
    adb(
      'shell',
      'am',
      'start',
      '-n',
      'com.lynx.explorer/.LynxViewShellActivity',
      '-e',
      'url',
      `http://${target.bundleHost}:${port}/main.lynx.bundle`,
    ),
    { env: adbEnv(env), inherit: false, throwOnError: false },
  );
  // Fixed render wait so the bundle loads before the screenshot.
  await new Promise((r) => setTimeout(r, 7000));
  // A locked device (common on MIUI/OEM) hides the app behind the keyguard, and
  // programmatic unlock is blocked (INJECT_EVENTS / secure lock). Capturing then
  // yields a blank/lock-screen PNG, which is misleading. Refuse to screenshot
  // while locked and tell the user to unlock instead of emitting a bad image.
  if (!(await isDeviceUnlocked(env, target.serial))) {
    throw new Error(
      'android: device is locked — unlock it (enter PIN/pattern) and re-run `dx android` ' +
        'so the screenshot captures the app. MIUI blocks adb-based unlock.',
    );
  }
  // Capture via a shell redirect — piping `adb exec-out screencap -p` through
  // Node's spawn stdout corrupts the PNG with a stray leading byte, whereas a
  // direct redirect writes a clean file.
  const screencap = target.serial
    ? `adb -s ${target.serial} exec-out screencap -p ${redirect}`
    : `adb exec-out screencap -p ${redirect}`;
  await run(shell, [shellArg, screencap], {
    env: adbEnv(env),
  });
  console.log(`android: screenshot -> ${shot}`);
}

/** True when the device keyguard is NOT showing (so a screenshot would show
 *  the app, not the lock screen). MIUI/OEM devices re-lock on their own
 *  schedule even with `svc power stayon true`, and adb cannot unlock a secure
 *  lock, so we detect this and refuse to capture a misleading blank PNG. */
async function isDeviceUnlocked(
  env: { androidHome: string | null },
  serial: string | null | undefined,
): Promise<boolean> {
  const a = serial ? ['-s', serial, 'shell'] : ['shell'];
  try {
    const out = await run('adb', [...a, 'dumpsys', 'window'], {
      inherit: false,
      throwOnError: false,
      env: adbEnv(env),
    });
    // mDreamingLockscreen=true (or mShowingLockscreen=true) means locked.
    if (/mDreamingLockscreen=\s*true/.test(out.stdout)) return false;
    if (/mShowingLockscreen=\s*true/.test(out.stdout)) return false;
    return true;
  } catch {
    // If we can't determine state, optimistically allow the capture rather
    // than hard-failing the whole dx run.
    return true;
  }
}

function adbEnv(env: { androidHome: string | null }): NodeJS.ProcessEnv {
  const home = env.androidHome ?? '';
  return {
    ...process.env,
    ANDROID_HOME: home,
    PATH: `${home}/platform-tools:${home}/emulator:${process.env.PATH}`,
  };
}

/** True when an emulator is online and its package manager is ready to install. */
async function isEmulatorReady(env: {
  androidHome: string | null;
}): Promise<boolean> {
  const e = adbEnv(env);
  try {
    const st = await run('adb', ['get-state'], {
      inherit: false,
      throwOnError: false,
      env: e,
    });
    if (st.stdout.trim() !== 'device') return false;
    const pm = await run('adb', ['shell', 'pm', 'get-install-location'], {
      inherit: false,
      throwOnError: false,
      env: e,
    });
    return pm.code === 0 && pm.stdout.trim().length > 0;
  } catch {
    return false;
  }
}

/** Kill any running emulator (connected or detached survivor) and wait until
 *  `adb devices` reports none, so a fresh launch won't hit the
 *  "multiple emulators with the same AVD" FATAL. */
async function killEmulators(env: {
  androidHome: string | null;
}): Promise<void> {
  const e = adbEnv(env);
  for (let i = 0; i < 30; i++) {
    // Try the adb-controlled kill first.
    await run('adb', ['emu', 'kill'], {
      inherit: false,
      throwOnError: false,
      env: e,
    });
    // And nuke any leftover QEMU process directly (handles detached survivors).
    await run('pkill', ['-9', '-f', 'qemu-system'], {
      inherit: false,
      throwOnError: false,
    });
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const res = await run('adb', ['devices'], {
        inherit: false,
        throwOnError: false,
        env: e,
      });
      if (!/emulator-\d+\s+device/.test(res.stdout)) return;
    } catch {
      /* retry */
    }
  }
  // Best effort; if it still won't clear we let the launch attempt surface it.
}

async function waitForEmulator(): Promise<void> {
  const env = { androidHome: process.env.ANDROID_HOME ?? '' };
  // Up to 30 min: a cold API-36 boot on this machine can exceed 20 min before
  // the package manager reports ready (not just `device` state).
  for (let i = 0; i < 360; i++) {
    try {
      const res = await run('adb', ['get-state'], {
        inherit: false,
        throwOnError: false,
        env: adbEnv(env),
      });
      if (res.stdout.trim() !== 'device') continue;
      // `get-state` flips to `device` before the package manager is ready;
      // `adb install` would fail with "Can't find service: package" otherwise.
      const pm = await run('adb', ['shell', 'pm', 'get-install-location'], {
        inherit: false,
        throwOnError: false,
        env: adbEnv(env),
      });
      if (pm.code === 0 && pm.stdout.trim().length > 0) return;
    } catch {
      // transient adb error during boot; keep polling
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error('Emulator did not come online within 30 min.');
}
