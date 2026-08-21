/** @lynxmodule */
export declare class BackgroundTask {
  isAvailableAsync(): boolean;
  registerTaskAsync(taskName: string, options: string): boolean;
  unregisterTaskAsync(taskName: string): boolean;
  getStatus(): any;
}
