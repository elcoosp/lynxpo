/** @lynxmodule */
export declare class ApplicationModule {
  applicationName(): string;
  applicationId(): string;
  nativeApplicationVersion(): string;
  nativeBuildVersion(): string;
  androidId(): string;
  getInstallationTime(): number;
  getLastUpdateTime(): number;
}
