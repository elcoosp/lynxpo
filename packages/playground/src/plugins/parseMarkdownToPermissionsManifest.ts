// import fs from 'fs'
export function parseMarkdownToPermissionsManifest(
  markdown: string,
): PermissionsManifest {
  const permissionsManifest: PermissionsManifest = {
    permissions: [],
  };

  // Split the content into permission sections
  const permissionSections = markdown
    .split(/^### /gm)
    .filter((section) => section.trim().length > 0);

  // Process each permission section
  permissionSections.forEach((section) => {
    if (!section.trim()) return;

    const permissionInfo: PermissionInfo = {
      name: '',
      description: '',
      deprecated: false,
      replacement: null,
      protectionLevel: [],
      minSdk: 1,
      maxSdk: null,
      required: {
        autoInject: false,
        conditions: [],
      },
      categories: [],
      constantValue: '',
    };

    // Extract permission name (first line of the section)
    const nameMatch = section.match(/^([A-Z_]+)/);
    if (nameMatch) {
      permissionInfo.name = nameMatch[1];
    }

    // Extract API level
    const apiLevelMatch = section.match(/Added in \[API level (\d+)\]/i);
    if (apiLevelMatch) {
      permissionInfo.minSdk = parseInt(apiLevelMatch[1], 10);
    }

    // Extract constant value - format now has "Constant Value:" on a separate line
    const constantValueMatch = section.match(/Constant Value:\s*"([^"]+)"/);
    if (constantValueMatch) {
      permissionInfo.constantValue = constantValueMatch[1];
    }

    // Extract protection level - now may have whitespace before/after
    const protectionLevelMatch = section.match(/Protection level:\s*([a-z]+)/i);
    if (protectionLevelMatch) {
      permissionInfo.protectionLevel = [protectionLevelMatch[1].toLowerCase()];
    }

    // Extract description - now handling the new format with code blocks
    const lines = section.split('\n');
    const descriptionLines: string[] = [];
    let inDescription = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip until after the code block and API level line
      if (line.match(/```/) || line.match(/Added in \[API level/)) {
        continue;
      }

      // Start capturing after the code block
      if (!inDescription && line && !line.match(/^public static final/)) {
        inDescription = true;
      }

      // Stop capturing at protection level or constant value
      if (
        inDescription &&
        (line.match(/^Protection level:/) || line.match(/^Constant Value:/))
      ) {
        break;
      }

      // Capture description lines
      if (inDescription && line) {
        descriptionLines.push(line);
      }
    }

    // Create a concise description from the collected lines
    permissionInfo.description = createConciseDescription(
      descriptionLines.join(' '),
    );

    // Check for deprecation indicators in the description
    if (
      permissionInfo.description.toLowerCase().includes('deprecated') ||
      permissionInfo.description
        .toLowerCase()
        .includes('not for use by third-party')
    ) {
      permissionInfo.deprecated = true;

      // Try to extract replacement permission if deprecated
      const replacementMatch = permissionInfo.description.match(
        /use\s+`?\[?([A-Z_]+)\]?`?/i,
      );
      if (replacementMatch) {
        permissionInfo.replacement = replacementMatch[1];

        // Add deprecation info
        permissionInfo.deprecationInfo = {
          sinceApi: determineDeprecationApiLevel(
            permissionInfo.name,
            permissionInfo.minSdk,
          ),
          removalApi: determineRemovalApiLevel(
            permissionInfo.name,
            permissionInfo.minSdk,
          ),
          migrationGuide: generateMigrationGuideUrl(permissionInfo.name),
        };
      }
    }

    // Set categories based on permission characteristics
    permissionInfo.categories = determineCategories(
      permissionInfo.name,
      permissionInfo.description,
    );

    // Set required conditions based on permission characteristics
    permissionInfo.required = determineRequiredConditions(permissionInfo);

    // Add the permission to the manifest
    permissionsManifest.permissions.push(permissionInfo);
  });

  return permissionsManifest;
}

// Helper function to create a more concise description
function createConciseDescription(fullDescription: string): string {
  // Remove common phrases that add verbosity
  let concise = fullDescription
    .replace(/Allows an app to /i, '')
    .replace(/Allows applications to /i, '')
    .replace(/Allows an application to /i, '');

  // Truncate to first sentence if it's long
  if (concise.length > 100) {
    const firstSentence = concise.match(/^.+?\.(?:\s|$)/);
    if (firstSentence) {
      concise = firstSentence[0].trim();
    }
  }

  // Capitalize first letter
  return concise.charAt(0).toUpperCase() + concise.slice(1);
}

// Helper function to determine categories based on permission name and description
function determineCategories(name: string, description: string): string[] {
  const categories: string[] = [];
  const nameAndDesc = (name + ' ' + description).toLowerCase();

  // Define category mappings
  const categoryMappings = [
    { pattern: 'location', categories: ['location'] },
    { pattern: 'gps', categories: ['location', 'sensors'] },
    { pattern: 'precise location', categories: ['location', 'sensors'] },
    { pattern: 'bluetooth', categories: ['bluetooth', 'connectivity'] },
    { pattern: 'network', categories: ['network'] },
    { pattern: 'internet', categories: ['network'] },
    { pattern: 'wifi', categories: ['network', 'connectivity'] },
    { pattern: 'storage', categories: ['storage'] },
    { pattern: 'file', categories: ['storage'] },
    { pattern: 'media', categories: ['media', 'storage'] },
    { pattern: 'camera', categories: ['camera', 'media'] },
    { pattern: 'telephony', categories: ['telephony'] },
    { pattern: 'phone', categories: ['telephony'] },
    { pattern: 'call', categories: ['telephony'] },
    { pattern: 'sms', categories: ['telephony', 'messaging'] },
    { pattern: 'carrier', categories: ['telephony'] },
    { pattern: 'audio', categories: ['media', 'audio'] },
    { pattern: 'record', categories: ['media', 'audio'] },
    { pattern: 'microphone', categories: ['media', 'audio'] },
    { pattern: 'contact', categories: ['contacts'] },
    { pattern: 'calendar', categories: ['calendar'] },
    { pattern: 'account', categories: ['accounts'] },
    { pattern: 'sensor', categories: ['sensors'] },
    { pattern: 'biometric', categories: ['security', 'biometric'] },
    { pattern: 'fingerprint', categories: ['security', 'biometric'] },
    { pattern: 'notification', categories: ['notifications'] },
    { pattern: 'alarm', categories: ['system'] },
    { pattern: 'boot', categories: ['system'] },
    { pattern: 'background', categories: ['system', 'process'] },
    { pattern: 'service', categories: ['system', 'service'] },
  ];

  // Check all mappings against the name and description
  categoryMappings.forEach((mapping) => {
    if (nameAndDesc.includes(mapping.pattern)) {
      mapping.categories.forEach((category) => {
        if (!categories.includes(category)) {
          categories.push(category);
        }
      });
    }
  });

  // Special case for ACCESS_FINE_LOCATION
  if (name === 'ACCESS_FINE_LOCATION') {
    if (!categories.includes('sensors')) {
      categories.push('sensors');
    }
  }

  // If no categories found, add a default one based on the name
  if (categories.length === 0) {
    const nameParts = name.split('_');
    if (
      nameParts.length > 1 &&
      nameParts[0] !== 'ACCESS' &&
      nameParts[0] !== 'ANDROID'
    ) {
      categories.push(nameParts[0].toLowerCase());
    } else {
      categories.push('system');
    }
  }

  return categories;
}

// Helper function to determine required conditions based on permission characteristics
function determineRequiredConditions(permission: PermissionInfo): {
  autoInject: boolean;
  conditions: Array<{ ifFeature: string; requiredBy: string[] }>;
} {
  const result = {
    autoInject: false,
    conditions: [] as Array<{ ifFeature: string; requiredBy: string[] }>,
  };

  // Map permission names to required feature conditions
  const permissionFeatureMap: {
    [key: string]: { feature: string; components: string[] };
  } = {
    ACCESS_FINE_LOCATION: {
      feature: 'gps_functionality',
      components: ['FusedLocationProvider', 'LocationManager'],
    },
    ACCESS_COARSE_LOCATION: {
      feature: 'network_location',
      components: ['FusedLocationProvider', 'LocationManager'],
    },
    ACCESS_BACKGROUND_LOCATION: {
      feature: 'background_location_tracking',
      components: ['FusedLocationProvider', 'GeofencingApi'],
    },
    CAMERA: {
      feature: 'camera_functionality',
      components: ['CameraManager', 'CameraX'],
    },
    RECORD_AUDIO: {
      feature: 'audio_recording',
      components: ['MediaRecorder', 'AudioRecord'],
    },
    READ_EXTERNAL_STORAGE: {
      feature: 'file_access',
      components: ['ContentResolver', 'DocumentsProvider'],
    },
    WRITE_EXTERNAL_STORAGE: {
      feature: 'file_writing',
      components: ['ContentResolver', 'DocumentsProvider'],
    },
    READ_CONTACTS: {
      feature: 'contact_access',
      components: ['ContactsProvider', 'ContactsContract'],
    },
    BLUETOOTH_SCAN: {
      feature: 'bluetooth_discovery',
      components: ['BluetoothAdapter', 'BluetoothManager'],
    },
    CALL_PHONE: {
      feature: 'phone_calling',
      components: ['TelecomManager', 'TelephonyManager'],
    },
    ACCEPT_HANDOVER: {
      feature: 'call_handover',
      components: ['TelecomManager'],
    },
  };

  // Set auto-inject based on protection level
  if (permission.protectionLevel.includes('normal')) {
    result.autoInject = true;
  } else if (permission.protectionLevel.includes('dangerous')) {
    // Dangerous permissions usually need explicit user consent, so not auto-injected
    result.autoInject = false;

    // If we have a predefined condition for this permission, use it
    if (permissionFeatureMap[permission.name]) {
      const mapping = permissionFeatureMap[permission.name];
      result.conditions.push({
        ifFeature: mapping.feature,
        requiredBy: mapping.components,
      });
    } else {
      // Otherwise, generate a generic condition based on categories
      if (permission.categories.includes('location')) {
        result.conditions.push({
          ifFeature: 'location_functionality',
          requiredBy: ['LocationManager'],
        });
      } else if (permission.categories.includes('bluetooth')) {
        result.conditions.push({
          ifFeature: 'bluetooth_functionality',
          requiredBy: ['BluetoothAdapter'],
        });
      } else if (permission.categories.includes('media')) {
        result.conditions.push({
          ifFeature: 'media_access',
          requiredBy: ['MediaStore'],
        });
      } else if (permission.categories.includes('telephony')) {
        result.conditions.push({
          ifFeature: 'telephony_functionality',
          requiredBy: ['TelephonyManager'],
        });
      }
    }
  }

  return result;
}

// Helper function to determine deprecation API level
function determineDeprecationApiLevel(
  permissionName: string,
  minSdk: number,
): number {
  // This would ideally be based on actual data, but for this example we'll use a mapping
  const deprecationMap: { [key: string]: number } = {
    BIND_CARRIER_MESSAGING_SERVICE: 23,
    GET_ACCOUNTS: 23,
    READ_PROFILE: 23,
    WRITE_PROFILE: 23,
    ACCESS_CHECKIN_PROPERTIES: 28,
  };

  return deprecationMap[permissionName] || minSdk + 10; // Default to 10 versions after introduction
}

// Helper function to determine removal API level
function determineRemovalApiLevel(
  permissionName: string,
  minSdk: number,
): number {
  // This would ideally be based on actual data, but for this example we'll use a mapping
  const removalMap: { [key: string]: number } = {
    BIND_CARRIER_MESSAGING_SERVICE: 26,
    GET_ACCOUNTS: 28,
    READ_PROFILE: 28,
    WRITE_PROFILE: 28,
  };

  return removalMap[permissionName] || minSdk + 15; // Default to 15 versions after introduction
}

// Helper function to generate a migration guide URL
function generateMigrationGuideUrl(permissionName: string): string {
  // Convert to camelCase for URL-friendly format
  const parts = permissionName.split('_');
  const camelCase = parts
    .map((part, index) =>
      index === 0
        ? part.toLowerCase()
        : part.charAt(0) + part.slice(1).toLowerCase(),
    )
    .join('');

  return `https://developer.android.com/guide/topics/permissions/migration-guide#${camelCase}`;
}

// Interface definitions matching your requirements with camelCase
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

// Example usage
// const markdownText = "... your markdown text ...";
// const manifest = parseMarkdownToPermissionsManifest(markdownText);
// console.log(JSON.stringify(manifest, null, 2));

// Example usage
//   const markdownText = fs.readFileSync("/Users/admin/Documents/Repos/lynxpo/packages/device/src/raw-perms-doc.md").toString()
//   const manifest = parseMarkdownToPermissionsManifest(markdownText);
//   fs.writeFileSync("perms.json",JSON.stringify(manifest, null, 2));
