/** @lynxmodule */
export declare class AppleAuthentication {
  isAvailableAsync(): boolean;
  credentialAsync(options: string, cb: function): void;
  credentialStateAsync(user: string, cb: function): void;
}
