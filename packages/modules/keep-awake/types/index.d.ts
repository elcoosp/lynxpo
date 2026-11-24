/** @lynxmodule */
export declare class KeepAwakeModule {
  isActivated(): boolean;
  activateAsync(): Promise<void>;
  deactivateAsync(): Promise<void>;
  isActivatedAsync(): Promise<boolean>;
}
