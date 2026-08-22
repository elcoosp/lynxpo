// Auto-generated from SqliteModule.kt
import { useEffect, useState } from '@lynx-js/react';
import { SqliteModule } from './generated/SqliteModule';

export const getOpenDatabase = (name: string): void =>
  NativeModules.SqliteModule?.openDatabase?.(name);

export const useOpenDatabase = (name: string) => {
  const [value, setValue] = useState<void>();

  useEffect(() => {
    const fetchData = () => {
      const result = getOpenDatabase(name);
      setValue(result);
    };

    fetchData();
  }, [name]);

  return value;
};

export const getExecSync = (query: string): Record<string, any>[] =>
  NativeModules.SqliteModule?.execSync?.(query);

export const useExecSync = (query: string) => {
  const [value, setValue] = useState<Record<string, any>[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getExecSync(query);
      setValue(result);
    };

    fetchData();
  }, [query]);

  return value;
};

export const getGetAllSync = (query: string): Record<string, any>[] =>
  NativeModules.SqliteModule?.getAllSync?.(query);

export const useGetAllSync = (query: string) => {
  const [value, setValue] = useState<Record<string, any>[]>();

  useEffect(() => {
    const fetchData = () => {
      const result = getGetAllSync(query);
      setValue(result);
    };

    fetchData();
  }, [query]);

  return value;
};
