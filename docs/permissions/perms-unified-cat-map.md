Here’s a mapping between **Android permission categories** and their **iOS equivalents**, grouped by functionality. Note that iOS permissions are tied to `Info.plist` usage descriptions and frameworks, while Android uses manifest-based groups.

---

### **Permission Category Mapping**

| **Category** | **Android Permissions** | **iOS Equivalent** | **Notes** |
| --- | --- | --- | --- |
| **Camera** | `CAMERA` | `NSCameraUsageDescription` | Grants access to the device camera. |
| **Microphone** | `RECORD_AUDIO` | `NSMicrophoneUsageDescription` | Access to microphone for audio recording. |
| **Location** | `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `ACCESS_BACKGROUND_LOCATION` | `NSLocationWhenInUseUsageDescription`, `NSLocationAlwaysUsageDescription`, `NSLocationTemporaryUsageDescription` | iOS requires explicit foreground/background usage descriptions. Android uses separate permissions for background access. |
| **Contacts** | `READ_CONTACTS`, `WRITE_CONTACTS` | `NSContactsUsageDescription` | iOS grants read/write access via a single key. |
| **Calendar** | `READ_CALENDAR`, `WRITE_CALENDAR` | `NSCalendarsUsageDescription` | iOS combines read/write access into one key. |
| **Photos/Media** | `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `READ_EXTERNAL_STORAGE` | `NSPhotoLibraryUsageDescription`, `NSPhotoLibraryAddUsageDescription` | iOS separates read and write access to the photo library. Android groups media permissions by type. |
| **Bluetooth** | `BLUETOOTH`, `BLUETOOTH_ADMIN`, `BLUETOOTH_CONNECT`, etc. | `NSBluetoothAlwaysUsageDescription`, `NSBluetoothPeripheralUsageDescription` | iOS requires usage descriptions for Bluetooth, and apps must declare `bluetooth-le` or `bluetooth` in `Info.plist` under `UIBackgroundModes` for background use. |
| **Sensors** | `BODY_SENSORS`, `ACTIVITY_RECOGNITION` | `NSMotionUsageDescription` | iOS combines motion (accelerometer, gyroscope) into one key. Android splits sensor types. |
| **Notifications** | `POST_NOTIFICATIONS` (Android 13+) | Implicit (no `Info.plist` key). iOS permissions are granted at runtime via user prompts. | Android requires a runtime permission for notifications starting in API 33. |
| **Health** | `android.permission.health.READ_STEPS` (via Health Connect) | `NSHealthShareUsageDescription`, `NSHealthUpdateUsageDescription` | iOS requires HealthKit integration. Android uses Health Connect for cross-app health data. |
| **Biometrics** | `USE_BIOMETRIC`, `USE_FINGERPRINT` | `NSFaceIDUsageDescription` | iOS uses Face ID/Touch ID descriptions. Android groups biometric authentication under `USE_BIOMETRIC`. |
| **SMS/Call Logs** | `READ_SMS`, `SEND_SMS`, `READ_CALL_LOG` | Not available on iOS. | iOS restricts access to SMS/call history for privacy reasons. |
| **Network** | `INTERNET` (implicit), `ACCESS_NETWORK_STATE` | No explicit permission. Apps declare network usage via capabilities (e.g., `App Transport Security`). | Android requires `INTERNET` in the manifest. iOS handles network security through `Info.plist` settings. |
| **Background Updates** | `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`, `WAKE_LOCK` | Background modes in `Info.plist` (e.g., `audio`, `location`, `fetch`). | iOS requires declaring background capabilities (e.g., `UIBackgroundModes`). |
| **Nearby Devices** | `NEARBY_WIFI_DEVICES` (Android 13+) | `NSLocalNetworkUsageDescription`, `NSBonjourServices` | iOS requires a description for local network access. |
| **Voice Assistants** | `BIND_VOICE_INTERACTION` | `NSSpeechRecognitionUsageDescription` | iOS requires a speech recognition usage description. |

---

### **Key Differences**

1. **Runtime vs. Install-Time**:
    
    - Android: Permissions are declared in the manifest and granted at install/runtime.
        
    - iOS: Permissions are dynamic, granted via user prompts, and tied to `Info.plist` keys.
        
2. **Granularity**:
    
    - Android: Splits permissions into fine-grained categories (e.g., `READ_CONTACTS` vs. `WRITE_CONTACTS`).
        
    - iOS: Often combines read/write access into a single key (e.g., `NSContactsUsageDescription`).
        
3. **Hardware Requirements**:
    
    - iOS: Uses `requiredDeviceCapabilities` (e.g., `camera`, `bluetooth-le`) in `Info.plist`.
        
    - Android: Uses `<uses-feature>` declarations in the manifest.
        

---

### **Unified Category Example**

To map both platforms into a shared category system (e.g., for your `PermissionInfo` API):

typescript

Copy

// Unified categories for cross-platform use
type UnifiedCategory =
  | "camera"
  | "microphone"
  | "location"
  | "contacts"
  | "calendar"
  | "photos"
  | "bluetooth"
  | "sensors"
  | "notifications"
  | "health"
  | "biometrics"
  | "network"
  | "background"
  | "nearby_devices";

---

### **References**

- **Android Permissions**: [Official List](https://developer.android.com/reference/android/Manifest.permission)
    
- **iOS Usage Descriptions**: [Apple Privacy Keys](https://developer.apple.com/documentation/bundleresources/information_property_list#Privacy-Specific_Keys)
    

This mapping ensures your unified API can handle cross-platform permission logic while respecting platform-specific requirements.