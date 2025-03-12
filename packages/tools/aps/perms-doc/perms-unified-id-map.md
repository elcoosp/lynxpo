Below is a **comprehensive mapping of unified permission IDs** for Android and iOS, covering major categories and their platform-specific equivalents. This list aligns with your `PermissionInfo` API structure and emphasizes cross-platform consistency.

---

### **Unified Permission ID List**

_(Key: `id` → Universal identifier for cross-platform use)_

| **Unified ID** | **Android Permission** (`constantValue`) | **iOS Permission** (`usageDescriptionKey`) | **Notes** |
| --- | --- | --- | --- |
| **camera_access** | `android.permission.CAMERA` | `NSCameraUsageDescription` | Grants access to the device camera. |
| **microphone_access** | `android.permission.RECORD_AUDIO` | `NSMicrophoneUsageDescription` | Required for audio recording. |
| **location_foreground** | `android.permission.ACCESS_FINE_LOCATION`  
`ACCESS_COARSE_LOCATION` | `NSLocationWhenInUseUsageDescription` | Foreground location access. Android splits into fine/coarse; iOS uses a single key. |
| **location_background** | `android.permission.ACCESS_BACKGROUND_LOCATION` | `NSLocationAlwaysAndWhenInUseUsageDescription` (iOS 11+) | Background location access. Requires additional justification on Android. |
| **contacts_read** | `android.permission.READ_CONTACTS` | `NSContactsUsageDescription` | iOS combines read/write access. |
| **contacts_write** | `android.permission.WRITE_CONTACTS` | (Implicit with `NSContactsUsageDescription`) | Android separates write access; iOS uses the same key. |
| **calendar_read** | `android.permission.READ_CALENDAR` | `NSCalendarsUsageDescription` | iOS combines read/write access. |
| **calendar_write** | `android.permission.WRITE_CALENDAR` | (Implicit with `NSCalendarsUsageDescription`) | Android separates write access. |
| **photos_read** | `android.permission.READ_MEDIA_IMAGES`  
`READ_MEDIA_VIDEO` | `NSPhotoLibraryUsageDescription` | Access to the photo library (read-only). |
| **photos_write** | `android.permission.READ_MEDIA_IMAGES` (write via `MediaStore`) | `NSPhotoLibraryAddUsageDescription` | Add photos to the library (iOS-only explicit key). |
| **bluetooth_connect** | `android.permission.BLUETOOTH_CONNECT` (API 31+) | `NSBluetoothAlwaysUsageDescription` | Required for Bluetooth pairing/data transfer. |
| **bluetooth_scan** | `android.permission.BLUETOOTH_SCAN` (API 31+) | `NSBluetoothPeripheralUsageDescription` | Scanning for nearby devices. |
| **sensors_motion** | `android.permission.ACTIVITY_RECOGNITION` | `NSMotionUsageDescription` | Access to accelerometer/gyroscope (e.g., step counting). |
| **sensors_health** | `android.permission.BODY_SENSORS` | `NSHealthShareUsageDescription` | Health data (e.g., heart rate). Requires HealthKit on iOS. |
| **notifications** | `android.permission.POST_NOTIFICATIONS` (API 33+) | (Implicit; no `Info.plist` key) | Android requires runtime permission starting in API 33. iOS prompts automatically. |
| **biometrics** | `android.permission.USE_BIOMETRIC` | `NSFaceIDUsageDescription` | Face ID/Touch ID on iOS. |
| **local_network** | `android.permission.NEARBY_WIFI_DEVICES` (API 33+) | `NSLocalNetworkUsageDescription` | Access to local network devices (e.g., printers, IoT). |
| **speech_recognition** | `android.permission.RECORD_AUDIO` (implicit) | `NSSpeechRecognitionUsageDescription` | Speech-to-text functionality. |
| **background_fetch** | (Implicit with `JobScheduler`/`WorkManager`) | `UIBackgroundModes` → `fetch` | iOS requires declaring background modes in `Info.plist`. |
| **background_location** | `android.permission.ACCESS_BACKGROUND_LOCATION` | `NSLocationAlwaysUsageDescription` (deprecated in iOS 13) | Use `NSLocationAlwaysAndWhenInUseUsageDescription` for modern iOS. |
| **file_storage** | `android.permission.READ_EXTERNAL_STORAGE`  
`WRITE_EXTERNAL_STORAGE` | (Not required; sandboxed by default) | iOS apps have sandboxed storage. Android requires explicit permissions. |
| **camera_advanced** | `android.permission.CAMERA` | `NSCameraUsageDescription` + `AVCaptureDevice` framework | Manual camera controls (e.g., zoom, focus). |
| **nearby_devices** | `android.permission.NEARBY_WIFI_DEVICES` | `NSBonjourServices` (for mDNS/Bonjour) | Discover nearby devices on the network. |
| **voice_assistant** | `android.permission.BIND_VOICE_INTERACTION` | `NSSpeechRecognitionUsageDescription` | Integration with voice assistants (e.g., Siri, Google Assistant). |
| **system_alert_window** | `android.permission.SYSTEM_ALERT_WINDOW` | (Not available on iOS) | Android-only permission for drawing overlays. |
| **sms_read** | `android.permission.READ_SMS` | (Not available on iOS) | iOS restricts SMS access. |
| **sms_send** | `android.permission.SEND_SMS` | (Not available on iOS) | iOS apps cannot send SMS programmatically without user interaction. |

---

### **Key Observations**

1. **iOS Restrictions**:
    
    - No SMS/call log access.
        
    - Storage is sandboxed (no `READ_EXTERNAL_STORAGE` equivalent).
        
    - Background modes (e.g., `UIBackgroundModes`) are declared in `Info.plist`, not via runtime permissions.
        
2. **Android Granularity**:
    
    - Splits permissions like `READ_CONTACTS`/`WRITE_CONTACTS`, while iOS uses a single key.
        
    - Requires explicit storage permissions for shared files.
        
3. **Unified Logic**:
    
    - Use the `id` field (e.g., `camera_access`) to reference permissions cross-platform.
        
    - Hide platform-specific details under `platforms.android` or `platforms.ios` in your API.
        

---

### **Example Unified JSON Entry**

json

Copy

{
  "id": "camera_access",
  "name": "Camera Access",
  "description": "Allows the app to take photos and record videos.",
  "deprecated": false,
  "replacement": null,
  "categories": ["camera", "media"],
  "platforms": {
    "android": {
      "name": "CAMERA",
      "constantValue": "android.permission.CAMERA",
      "protectionLevel": ["dangerous"],
      "minSdk": 1
    },
    "ios": {
      "usageDescriptionKey": "NSCameraUsageDescription",
      "privacyDescription": "This app needs camera access to capture photos.",
      "requiredDeviceCapabilities": ["camera"],
      "minIosVersion": "11.0"
    }
  }
}

---

### **How to Use This List**

1. **Cross-Platform Checks**:
    
    typescript
    
    Copy
    
    if (permission.id === "camera_access") {
      // Check Android/iOS-specific details via permission.platforms[os]
    }
    
2. **Permission Requests**:
    
    - Use the `id` to trigger platform-native permission dialogs (e.g., `request("camera_access")`).
        
3. **Deprecation Handling**:
    
    - Map deprecated permissions (e.g., Android’s `WRITE_EXTERNAL_STORAGE`) to modern replacements.
        

For a complete list of iOS keys, refer to Apple’s [**Privacy-Specific Keys**](https://developer.apple.com/documentation/bundleresources/information_property_list#Privacy-Specific_Keys). For Android, see the [**Manifest Permissions**](https://developer.android.com/reference/android/Manifest.permission) list.