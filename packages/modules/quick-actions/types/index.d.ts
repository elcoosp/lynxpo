/** @lynxmodule */
export declare class QuickActionsModule {
  getShortcutItemsAsync(): Promise<any>;
  setShortcutItemsAsync(items: any): Promise<void>;
  clearShortcutItemsAsync(): Promise<void>;
  initialActionAsync(): Promise<any>;
}
