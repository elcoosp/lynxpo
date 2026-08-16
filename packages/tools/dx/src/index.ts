import { Command } from 'commander';
import { dxAndroid } from './steps/android.js';
import { dxBuild } from './steps/build.js';
import { dxDoctor } from './steps/doctor.js';
import { dxInject } from './steps/inject.js';
import { dxIos } from './steps/ios.js';
import { dxPerms } from './steps/perms.js';
import { dxTypes } from './steps/types.js';

function wrap(
  fn: (...args: any[]) => Promise<void>,
): (...args: any[]) => Promise<void> {
  return async (...args: any[]) => {
    try {
      await fn(...args);
    } catch (err) {
      console.error(`\n✗ ${(err as Error).message}`);
      process.exit(1);
    }
  };
}

const program = new Command();
program
  .name('lynxpo')
  .description('Unified local dev experience for lynxpo')
  .version('0.0.0');

program
  .command('perms')
  .description('Regenerate permission manifests (aps)')
  .action(wrap(dxPerms));
program
  .command('types')
  .description('Regenerate TS bindings for native modules (ktts)')
  .action(wrap(dxTypes));
program
  .command('build')
  .description('Build playground bundle + inject native modules')
  .action(wrap(dxBuild));
program
  .command('inject')
  .description('Inject native modules into Lynx Explorer (nmi)')
  .action(wrap(dxInject));
program
  .command('ios')
  .description('Build, install, launch + screenshot on iOS simulator')
  .action(wrap(dxIos));
program
  .command('android')
  .description('Build, install, launch + screenshot on Android emulator')
  .option('-p, --port <port>', 'static server port for the bundle', '8137')
  .option('-a, --avd <name>', 'AVD name to launch', 'Medium_Phone_API_36.1')
  .option('--headless', 'launch emulator with no window')
  .action(
    wrap(async (opts: { port: string; avd: string; headless?: boolean }) =>
      dxAndroid({
        port: Number(opts.port),
        avd: opts.avd,
        headless: opts.headless,
      }),
    ),
  );
program
  .command('doctor')
  .description('Environment preflight check')
  .action(wrap(dxDoctor));

program.parseAsync(process.argv).catch((err) => {
  console.error(err);
  process.exit(1);
});
