import { detectEnv, isJava11 } from '../env.js';

/** Print an environment report and exit non-zero on any hard blocker. */
export async function dxDoctor(): Promise<void> {
  const env = await detectEnv();
  const ok = (b: boolean) => (b ? 'ok' : 'MISSING');
  const warn = (b: boolean) => (b ? 'ok' : 'WARN');

  console.log('lynxpo doctor — environment report');
  console.log('----------------------------------');
  console.log(`repo root        : ${env.repoRoot}`);
  console.log(`engine root      : ${env.engineRoot}`);
  console.log(
    `java             : ${env.javaVersion ?? 'none'} (${warn(isJava11(env.javaVersion))} for android)`,
  );
  console.log(`JAVA_HOME        : ${env.javaHome ?? 'none'}`);
  console.log(
    `ANDROID_HOME     : ${env.androidHome ?? 'none'} (${ok(env.androidSdkPresent)})`,
  );
  console.log(`xcode            : ${ok(env.xcodePresent)}`);
  console.log(`booted iOS sim   : ${env.bootedSim ?? 'none'}`);
  console.log(
    `android emulator : ${env.emulatorOnline ? 'online' : 'offline'}`,
  );

  const blockers: string[] = [];
  if (!env.xcodePresent)
    blockers.push('xcodebuild not found (needed for dx ios)');
  if (!env.androidSdkPresent)
    blockers.push('ANDROID_HOME/SDK missing (needed for dx android)');
  if (
    env.androidHome &&
    !isJava11(env.javaVersion) &&
    !(env.javaHome ?? '').includes('jdk11')
  ) {
    blockers.push(
      'Java 11 required for dx android (set JAVA_HOME=~/jdk11/Contents/Home)',
    );
  }

  if (blockers.length) {
    console.log('\nBlockers:');
    for (const b of blockers) console.log(`  - ${b}`);
    throw new Error(`${blockers.length} environment blocker(s)`);
  }
  console.log('\nAll clear.');
}
