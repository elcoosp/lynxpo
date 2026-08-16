import { dxInject } from './inject.js';
import { dxTypes } from './types.js';

/**
 * Full local bundle build: regenerate ktts types, build the playground bundle,
 * then inject native modules into the engine explorer.
 */
export async function dxBuild(): Promise<void> {
  await dxTypes();
  await dxInject();
  console.log('build: playground bundle built and native modules injected');
}
