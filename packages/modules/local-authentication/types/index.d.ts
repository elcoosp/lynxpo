/** @lynxmodule */
export declare class LocalAuthenticationModule {
  hasHardware(): boolean;
  isEnrolled(): boolean;
  getEnrolledLevel(): string | null;
  supportedAuthenticationTypes(): string | null;
  hasHardwareAsync(): any;
  isEnrolledAsync(): any;
  getEnrolledLevelAsync(): any;
  supportedAuthenticationTypesAsync(): any;
  authenticateAsync(prompt: string, cb: function): void;
}
