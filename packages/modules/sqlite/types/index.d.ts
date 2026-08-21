/** @lynxmodule */
export declare class SqliteModule {
  openDatabase(name: string): void;
  execSync(query: string): any;
  getAllSync(query: string): any;
}
