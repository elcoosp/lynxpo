interface PermissionInfo {
    // Common Fields
    id: string; // e.g., "camera_access"
    name: string;
    description: string;
    deprecated: boolean;
    replacement: string | null; // Cross-platform ID or platform-specific key
    categories: string[]; // e.g., ["camera", "sensors"]
  
    // Deprecation (common structure)
    deprecationInfo?: {
      deprecatedSince?: string | number;
      removalPlan?: string | number;
      migrationGuide?: string;
      platforms?: {
        android?: { sinceApi: number; removalApi: number };
        ios?: { sinceVersion: string; removalVersion: string };
      };
    };
  
    // Required Conditions (common structure)
    required?: {
      mandatory?: boolean;
      autoInject?: boolean;
      conditions?: {
        android?: Array<{ ifFeature: string; requiredBy: string[] }>;
        ios?: Array<{ ifFeature?: string; requiredFrameworks?: string[] }>;
      };
    };
  
    // Platform-Specific Details
    platforms: {
      android?: {
        name: string; // e.g., "CAMERA"
        protectionLevel: string[];
        minSdk: number;
        constantValue: string; // e.g., "android.permission.CAMERA"
      };
      ios?: {
        usageDescriptionKey: string; // e.g., "NSCameraUsageDescription"
        privacyDescription: string; // User-facing text
        requiredDeviceCapabilities: string[];
        minIosVersion: string;
      };
    };
  }