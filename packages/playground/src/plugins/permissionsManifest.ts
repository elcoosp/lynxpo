export interface PermissionInfo {
  name: string;
  description: string;
  deprecated: boolean;
  replacement: string | null;
  protectionLevel: string[];
  minSdk: number;
  maxSdk: number | null;
  required: {
    autoInject: boolean;
    conditions: Array<{
      ifFeature: string;
      requiredBy: string[];
    }>;
  };
  categories: string[];
  constantValue: string;
  deprecationInfo?: {
    sinceApi: number;
    removalApi: number;
    migrationGuide: string;
  };
}

export interface PermissionsManifest {
  permissions: PermissionInfo[];
}
