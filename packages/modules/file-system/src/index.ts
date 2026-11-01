import { FileSystemModule } from './generated/FileSystemModule';

export interface FileSystemInfo {
  exists: boolean;
  isDirectory: boolean;
  size: number;
  uri: string;
}

export const writeAsStringAsync = (
  path: string,
  contents: string,
): Promise<void> => FileSystemModule?.writeAsStringAsync?.(path, contents);

export const readAsStringAsync = (path: string): Promise<string> =>
  FileSystemModule?.readAsStringAsync?.(path);

export const getInfoAsync = (path: string): Promise<FileSystemInfo> =>
  FileSystemModule?.getInfoAsync?.(path);

export const makeDirectoryAsync = (path: string): Promise<boolean> =>
  FileSystemModule?.makeDirectoryAsync?.(path);

export const deleteAsync = (path: string): Promise<boolean | null> =>
  FileSystemModule?.deleteAsync?.(path);
