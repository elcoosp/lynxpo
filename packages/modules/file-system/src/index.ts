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
  FileSystemModule?.readAsStringAsync?.(path) as unknown as Promise<string>;

export const getInfoAsync = (path: string): Promise<FileSystemInfo> =>
  FileSystemModule?.getInfoAsync?.(path) as unknown as Promise<FileSystemInfo>;

export const makeDirectoryAsync = (path: string): Promise<boolean> =>
  FileSystemModule?.makeDirectoryAsync?.(path) as unknown as Promise<boolean>;

export const deleteAsync = (path: string): Promise<boolean | null> =>
  FileSystemModule?.deleteAsync?.(path) as unknown as Promise<boolean | null>;
