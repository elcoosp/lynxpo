/** @lynxmodule */
export declare class TaskManager {
  isTaskRegistered(taskName: string): boolean;
  getRegisteredTasks(): any;
  unregisterTaskAsync(taskName: string): void;
}
