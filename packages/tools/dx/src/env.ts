import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { engineRoot, resolveRepoRoot, run } from './exec.js';

export interface Env {
  repoRoot: string;
  engineRoot: string;
  javaVersion: string | null;
  javaHome: string | null;
  androidHome: string | null;
  androidSdkPresent: boolean;
  xcodePresent: boolean;
  /** UDID of a booted iOS simulator, if any. */
  bootedSim: string | null;
  /** Whether an Android emulator is online (adb get-state == device). */
  emulatorOnline: boolean;
}

function parseJavaVersion(raw: string): string | null {
  // java -version prints to stderr, e.g. 'openjdk version "11.0.32" 2026-...'
  const m = raw.match(/version "(\d+(?:\.\d+)?)/);
  return m ? m[1] : null;
}

/** True when the given java version string is major version 11. */
export function isJava11(version: string | null): boolean {
  if (!version) return false;
  return version.startsWith('11');
}

async function detectBootedSim(): Promise<string | null> {
  try {
    const res = await run('xcrun', ['simctl', 'list', 'devices', 'booted'], {
      inherit: false,
      throwOnError: false,
    });
    const m = res.stdout.match(/\(([0-9A-F-]{36})\)\s+\(Booted\)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

async function detectEmulator(): Promise<boolean> {
  try {
    const home = process.env.ANDROID_HOME ?? '';
    const env = {
      ...process.env,
      ANDROID_HOME: home,
      PATH: `${home}/platform-tools:${home}/emulator:${process.env.PATH}`,
    };
    const res = await run('adb', ['devices'], {
      inherit: false,
      throwOnError: false,
      env,
    });
    // Look for any emulator already online (state `device`), e.g.
    //   emulator-5554  device
    return /emulator-\d+\s+device/.test(res.stdout);
  } catch {
    return false;
  }
}

export async function detectEnv(cwd: string = process.cwd()): Promise<Env> {
  const repoRoot = resolveRepoRoot(cwd);
  const engine = engineRoot(repoRoot);

  let javaVersion: string | null = null;
  let javaHome: string | null = null;
  try {
    const res = await run('java', ['-version'], {
      inherit: false,
      throwOnError: false,
    });
    javaVersion = parseJavaVersion(res.stderr + res.stdout);
    javaHome = process.env.JAVA_HOME ?? null;
  } catch {
    /* java not on PATH */
  }

  const androidHome = process.env.ANDROID_HOME ?? null;
  const androidSdkPresent =
    !!androidHome && existsSync(resolve(androidHome, 'platform-tools/adb'));

  let xcodePresent = false;
  try {
    const res = await run('xcodebuild', ['-version'], {
      inherit: false,
      throwOnError: false,
    });
    xcodePresent = res.code === 0;
  } catch {
    /* no xcode */
  }

  const [bootedSim, emulatorOnline] = await Promise.all([
    detectBootedSim(),
    detectEmulator(),
  ]);

  return {
    repoRoot,
    engineRoot: engine,
    javaVersion,
    javaHome,
    androidHome,
    androidSdkPresent,
    xcodePresent,
    bootedSim,
    emulatorOnline,
  };
}
