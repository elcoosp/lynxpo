import type { NativeModules as INativeModules } from '@lynx-js/types';

export interface FileSystemInfo {
  exists: boolean;
  isDirectory: boolean;
  size: number;
  uri: string;
}

export interface FileSystemModule extends INativeModules {
  writeAsStringAsync(path: string, contents: string): Promise<void>;
  readAsStringAsync(path: string): Promise<string>;
  getInfoAsync(path: string): Promise<FileSystemInfo>;
  makeDirectoryAsync(path: string): Promise<boolean>;
  deleteAsync(path: string): Promise<boolean | null>;
}

export const writeAsStringAsync = (
  path: string,
  contents: string,
): Promise<void> =>
  NativeModules.FileSystemModule?.writeAsStringAsync?.(path, contents);

export const readAsStringAsync = (path: string): Promise<string> =>
  NativeModules.FileSystemModule?.readAsStringAsync?.(path);

export const getInfoAsync = (path: string): Promise<FileSystemInfo> =>
  NativeModules.FileSystemModule?.getInfoAsync?.(path);

export const makeDirectoryAsync = (path: string): Promise<boolean> =>
  NativeModules.FileSystemModule?.makeDirectoryAsync?.(path);

export const deleteAsync = (path: string): Promise<boolean | null> =>
  NativeModules.FileSystemModule?.deleteAsync?.(path);
