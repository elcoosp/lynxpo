[Skip Navigation](https://developer.apple.com/documentation/bundleresources/protected-resources#app-main)

Collection

- [Bundle Resources](https://developer.apple.com/documentation/bundleresources)
- [Information Property List](https://developer.apple.com/documentation/bundleresources/information-property-list)
- Protected resources

API Collection

# Protected resources

Control an app’s access to protected system services and user data.

## [Overview](https://developer.apple.com/documentation/bundleresources/protected-resources#overview)

Before your app can access certain protected resources, like the Bluetooth interface, location information, or the user’s photos, the system asks the user for permission on behalf of your app. To signal that your app needs the access, you add a `UsageDescription` key to your app’s [`Information Property List`](https://developer.apple.com/documentation/bundleresources/information-property-list). You set the value associated with the key to a string that explains why your app needs access. The system displays this string when prompting the user, as described in [Requesting access to protected resources](https://developer.apple.com/documentation/UIKit/requesting-access-to-protected-resources).

## [Topics](https://developer.apple.com/documentation/bundleresources/protected-resources#topics)

### [Essentials](https://developer.apple.com/documentation/bundleresources/protected-resources#Essentials)

[Requesting access to protected resources](https://developer.apple.com/documentation/UIKit/requesting-access-to-protected-resources)

Provide a purpose string that explains to a person why you need access to protected resources on their device.

[Inspecting app activity data](https://developer.apple.com/documentation/Network/inspecting-app-activity-data)

Verify that your app accesses only the user data and network resources that you expect it to access.

### [Bluetooth](https://developer.apple.com/documentation/bundleresources/protected-resources#Bluetooth)

[`NSBluetoothAlwaysUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsbluetoothalwaysusagedescription)

A message that tells the user why the app needs access to Bluetooth.

**Name:** Privacy - Bluetooth Always Usage Description

[`NSBluetoothPeripheralUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsbluetoothperipheralusagedescription)

A message that tells the user why the app is requesting the ability to connect to Bluetooth peripherals.

**Name:** Privacy - Bluetooth Peripheral Usage Description

Deprecated

### [Calendar and reminders](https://developer.apple.com/documentation/bundleresources/protected-resources#Calendar-and-reminders)

[`NSCalendarsFullAccessUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nscalendarsfullaccessusagedescription)

A message that tells people why the app is requesting access to read and write their calendar data.

**Name:** Privacy - Calendars Full Access Usage Description

[`NSCalendarsWriteOnlyAccessUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nscalendarswriteonlyaccessusagedescription)

A message that tells people why the app is requesting access to create calendar events.

**Name:** Privacy - Calendars Write Only Usage Description

[`NSRemindersFullAccessUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsremindersfullaccessusagedescription)

A message that tells people why the app is requesting access to read and write their reminders data.

**Name:** Privacy - Reminders Full Access Usage Description

[Accessing the event store](https://developer.apple.com/documentation/EventKit/accessing-the-event-store)

Request access to a person’s calendar data through the event store.

### [Camera and microphone](https://developer.apple.com/documentation/bundleresources/protected-resources#Camera-and-microphone)

[Requesting authorization to capture and save media](https://developer.apple.com/documentation/AVFoundation/requesting-authorization-to-capture-and-save-media)

Prompt the user to authorize access to the camera, microphone, and photo library.

[Requesting Authorization for Media Capture on macOS](https://developer.apple.com/documentation/bundleresources/requesting-authorization-for-media-capture-on-macos)

Prompt the user to authorize access to the camera and microphone.

[`NSCameraUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nscamerausagedescription)

A message that tells the user why the app is requesting access to the device’s camera.

**Name:** Privacy - Camera Usage Description

[`NSMicrophoneUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsmicrophoneusagedescription)

A message that tells the user why the app is requesting access to the device’s microphone.

**Name:** Privacy - Microphone Usage Description

### [Contacts](https://developer.apple.com/documentation/bundleresources/protected-resources#Contacts)

[Accessing the contact store](https://developer.apple.com/documentation/Contacts/accessing-the-contact-store)

Request permission from the person to read and write their contact data.

[`NSContactsUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nscontactsusagedescription)

A message that tells the user why the app is requesting access to the user’s contacts.

**Name:** Privacy - Contacts Usage Description

### [Face ID](https://developer.apple.com/documentation/bundleresources/protected-resources#Face-ID)

[Logging a User into Your App with Face ID or Touch ID](https://developer.apple.com/documentation/LocalAuthentication/logging-a-user-into-your-app-with-face-id-or-touch-id)

Supplement your own authentication scheme with biometric authentication, making it easy for users to access sensitive parts of your app.

[`NSFaceIDUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsfaceidusagedescription)

A message that tells the user why the app is requesting the ability to authenticate with Face ID.

**Name:** Privacy - Face ID Usage Description

### [Files and folders](https://developer.apple.com/documentation/bundleresources/protected-resources#Files-and-folders)

[`NSDesktopFolderUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsdesktopfolderusagedescription)

A message that tells the user why the app needs access to the user’s Desktop folder.

**Name:** Privacy - Desktop Folder Usage Description

[`NSDocumentsFolderUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsdocumentsfolderusagedescription)

A message that tells the user why the app needs access to the user’s Documents folder.

**Name:** Privacy - Documents Folder Usage Description

[`NSDownloadsFolderUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsdownloadsfolderusagedescription)

A message that tells the user why the app needs access to the user’s Downloads folder.

**Name:** Privacy - Downloads Folder Usage Description

[`NSNetworkVolumesUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsnetworkvolumesusagedescription)

A message that tells the user why the app needs access to files on a network volume.

**Name:** Privacy - Network Volumes Usage Description

[`NSRemovableVolumesUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsremovablevolumesusagedescription)

A message that tells the user why the app needs access to files on a removable volume.

**Name:** Privacy - Removable Volumes Usage Description

[`NSFileProviderDomainUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsfileproviderdomainusagedescription)

A message that tells the user why the app needs access to files managed by a file provider.

**Name:** Privacy - Access to a File Provider Domain Usage Description

### [Game center](https://developer.apple.com/documentation/bundleresources/protected-resources#Game-center)

[`NSGKFriendListUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsgkfriendlistusagedescription)

A message that tells the user why the app needs access to their Game Center friends list.

### [Health](https://developer.apple.com/documentation/bundleresources/protected-resources#Health)

[Setting up HealthKit](https://developer.apple.com/documentation/HealthKit/setting-up-healthkit)

Set up and configure your HealthKit store.

[`NSHealthClinicalHealthRecordsShareUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nshealthclinicalhealthrecordsshareusagedescription)

A message to the user that explains why the app requested permission to read clinical records.

**Name:** Privacy - Health Records Usage Description

[`NSHealthShareUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nshealthshareusagedescription)

A message to the user that explains why the app requested permission to read samples from the HealthKit store.

**Name:** Privacy - Health Share Usage Description

[`NSHealthUpdateUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nshealthupdateusagedescription)

A message to the user that explains why the app requested permission to save samples to the HealthKit store.

**Name:** Privacy - Health Update Usage Description

[`NSHealthRequiredReadAuthorizationTypeIdentifiers`](https://developer.apple.com/documentation/bundleresources/information-property-list/nshealthrequiredreadauthorizationtypeidentifiers)

The clinical record data types that your app must get permission to read.

### [Home](https://developer.apple.com/documentation/bundleresources/protected-resources#Home)

[Enabling HomeKit in your app](https://developer.apple.com/documentation/HomeKit/enabling-homekit-in-your-app)

Declare your app’s intention to use HomeKit, and get permission from the user to access home automation accessories.

[`NSHomeKitUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nshomekitusagedescription)

A message that tells the user why the app is requesting access to the user’s HomeKit configuration data.

**Name:** Privacy - HomeKit Usage Description

### [Location](https://developer.apple.com/documentation/bundleresources/protected-resources#Location)

[Choosing the Location Services Authorization to Request](https://developer.apple.com/documentation/bundleresources/choosing-the-location-services-authorization-to-request)

Determine the authorization your app needs to access location data.

[`NSLocationAlwaysAndWhenInUseUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nslocationalwaysandwheninuseusagedescription)

A message that tells the user why the app is requesting access to the user’s location information at all times.

**Name:** Privacy - Location Always and When In Use Usage Description

[`NSLocationUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nslocationusagedescription)

A message that tells the user why the app is requesting access to the user’s location information.

**Name:** Privacy - Location Usage Description

[`NSLocationWhenInUseUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nslocationwheninuseusagedescription)

A message that tells the user why the app is requesting access to the user’s location information while the app is running in the foreground.

**Name:** Privacy - Location When In Use Usage Description

[`NSLocationTemporaryUsageDescriptionDictionary`](https://developer.apple.com/documentation/bundleresources/information-property-list/nslocationtemporaryusagedescriptiondictionary)

A collection of messages that explain why the app is requesting temporary access to the user’s location.

**Name:** Privacy - Location Temporary Usage Description Dictionary

[`NSLocationAlwaysUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nslocationalwaysusagedescription)

A message that tells the user why the app is requesting access to the user’s location at all times.

**Name:** Privacy - Location Always Usage Description

Deprecated

[`NSWidgetWantsLocation`](https://developer.apple.com/documentation/bundleresources/information-property-list/nswidgetwantslocation)

A Boolean value that indicates a widget uses the user’s location information.

**Name:** Widget wants location

[`NSLocationDefaultAccuracyReduced`](https://developer.apple.com/documentation/bundleresources/information-property-list/nslocationdefaultaccuracyreduced)

A Boolean value that indicates whether the app requests reduced location accuracy by default.

**Name:** Privacy - Location Default Accuracy Reduced

### [MediaPlayer](https://developer.apple.com/documentation/bundleresources/protected-resources#MediaPlayer)

[Requesting Access to Apple Music Library](https://developer.apple.com/documentation/StoreKit/requesting-access-to-apple-music-library)

Prompt the customer to authorize access to Apple Music library.

[`NSAppleMusicUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsapplemusicusagedescription)

A message that tells the user why the app is requesting access to the user’s media library.

**Name:** Privacy - Media Library Usage Description

### [Motion](https://developer.apple.com/documentation/bundleresources/protected-resources#Motion)

[`NSMotionUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsmotionusagedescription)

A message that tells the user why the app is requesting access to the device’s motion data.

**Name:** Privacy - Motion Usage Description

[`NSFallDetectionUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsfalldetectionusagedescription)

A message to the user that explains the app’s request for permission to access fall detection event data.

**Name:** Fall Detection Usage Description

### [Networking](https://developer.apple.com/documentation/bundleresources/protected-resources#Networking)

[`NSLocalNetworkUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nslocalnetworkusagedescription)

A message that tells the user why the app is requesting access to the local network.

**Name:** Privacy - Local Network Usage Description

[`NSNearbyInteractionUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsnearbyinteractionusagedescription)

A request for user permission to begin an interaction session with nearby devices.

**Name:** Privacy - Nearby Interaction Usage Description

[`NSNearbyInteractionAllowOnceUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsnearbyinteractionallowonceusagedescription)

A one-time request for user permission to begin an interaction session with nearby devices.

**Name:** Privacy - Nearby Interaction Allow Once Usage Description

Deprecated

### [NFC](https://developer.apple.com/documentation/bundleresources/protected-resources#NFC)

[`NFCReaderUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nfcreaderusagedescription)

A message that tells the user why the app is requesting access to the device’s NFC hardware.

**Name:** Privacy - NFC Scan Usage Description

### [Photos](https://developer.apple.com/documentation/bundleresources/protected-resources#Photos)

[Delivering an Enhanced Privacy Experience in Your Photos App](https://developer.apple.com/documentation/PhotoKit/delivering-an-enhanced-privacy-experience-in-your-photos-app)

Adopt the latest privacy enhancements to deliver advanced user-privacy controls.

[`NSPhotoLibraryAddUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsphotolibraryaddusagedescription)

A message that tells the user why the app is requesting add-only access to the user’s photo library.

**Name:** Privacy - Photo Library Additions Usage Description

[`NSPhotoLibraryUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsphotolibraryusagedescription)

A message that tells the user why the app is requesting access to the user’s photo library.

**Name:** Privacy - Photo Library Usage Description

### [Scripting](https://developer.apple.com/documentation/bundleresources/protected-resources#Scripting)

[`NSAppleScriptEnabled`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsapplescriptenabled)

A Boolean value indicating whether AppleScript is enabled.

**Name:** Scriptable

### [Security](https://developer.apple.com/documentation/bundleresources/protected-resources#Security)

[`NSUpdateSecurityPolicy`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsupdatesecuritypolicy)

A dictionary that identifies which apps or installer packages the operating system allows to write to the app’s bundle.

[`NSAppDataUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsappdatausagedescription)

A message that tells the user why the app needs to access files in other apps’ sandbox containers.

**Name:** Privacy - Other Application Data Usage Description

[`NSUserTrackingUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsusertrackingusagedescription)

A message that informs the user why an app is requesting permission to use data for tracking the user or the device.

**Name:** Privacy - Tracking Usage Description

[`NSAppleEventsUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsappleeventsusagedescription)

A message that tells the user why the app is requesting the ability to send Apple events.

**Name:** Privacy - AppleEvents Sending Usage Description

[`NSSystemAdministrationUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nssystemadministrationusagedescription)

A message in macOS that tells the user why the app is requesting to manipulate the system configuration.

**Name:** Privacy - System Administration Usage Description

[`ITSAppUsesNonExemptEncryption`](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption)

A Boolean value indicating whether the app uses encryption.

**Name:** App Uses Non-Exempt Encryption

[`ITSEncryptionExportComplianceCode`](https://developer.apple.com/documentation/bundleresources/information-property-list/itsencryptionexportcompliancecode)

The export compliance code provided by App Store Connect for apps that require it.

**Name:** App Encryption Export Compliance Code

### [Sensors](https://developer.apple.com/documentation/bundleresources/protected-resources#Sensors)

[`NSSensorKitUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nssensorkitusagedescription)

A short description of the purpose of your app’s research study.

[`NSSensorKitUsageDetail`](https://developer.apple.com/documentation/bundleresources/information-property-list/nssensorkitusagedetail)

A dictionary that includes keys for the specific information your app collects.

[`NSSensorKitPrivacyPolicyURL`](https://developer.apple.com/documentation/bundleresources/information-property-list/nssensorkitprivacypolicyurl)

A hyperlink to a webpage that displays the privacy policy for your app’s research study.

### [Siri](https://developer.apple.com/documentation/bundleresources/protected-resources#Siri)

[Requesting Authorization to Use Siri](https://developer.apple.com/documentation/SiriKit/requesting-authorization-to-use-siri)

Request permission from the user for Siri and Maps to communicate with your app or Intents app extension.

[`NSSiriUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nssiriusagedescription)

A message that tells the user why the app is requesting to send user data to Siri.

**Name:** Privacy - Siri Usage Description

### [Speech](https://developer.apple.com/documentation/bundleresources/protected-resources#Speech)

[Asking Permission to Use Speech Recognition](https://developer.apple.com/documentation/Speech/asking-permission-to-use-speech-recognition)

Ask the user’s permission to perform speech recognition using Apple’s servers.

[`NSSpeechRecognitionUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsspeechrecognitionusagedescription)

A message that tells the user why the app is requesting to send user data to Apple’s speech recognition servers.

**Name:** Privacy - Speech Recognition Usage Description

### [TV](https://developer.apple.com/documentation/bundleresources/protected-resources#TV)

[`NSVideoSubscriberAccountUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsvideosubscriberaccountusagedescription)

A message that tells the user why the app is requesting access to the user’s TV provider account.

**Name:** Privacy - Video Subscriber Account Usage Description

### [Vision](https://developer.apple.com/documentation/bundleresources/protected-resources#Vision)

[`NSWorldSensingUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsworldsensingusagedescription)

A message that tells the user why the app is requesting access to image tracking, plane detection, or scene reconstruction.

[`NSHandsTrackingUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nshandstrackingusagedescription)

A message that tells the user why the app is requesting access to track the user’s hand position and location.

### [Wallet](https://developer.apple.com/documentation/bundleresources/protected-resources#Wallet)

[`NSFinancialDataUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsfinancialdatausagedescription)

A message that tells the user why the app is requesting access to financial data stored in Wallet.

[`NSIdentityUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsidentityusagedescription)

A message that tells the user why the app is requesting identity information.

**Name:** Privacy - Identity Usage Description

### [Wi-Fi](https://developer.apple.com/documentation/bundleresources/protected-resources#Wi-Fi)

[`UIRequiresPersistentWiFi`](https://developer.apple.com/documentation/bundleresources/information-property-list/uirequirespersistentwifi)

A Boolean value that indicates whether the app requires a Wi-Fi connection.

**Name:** Application uses Wi-Fi

### [Deprecated keys](https://developer.apple.com/documentation/bundleresources/protected-resources#Deprecated-keys)

[`NSCalendarsUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nscalendarsusagedescription)

A message that tells people why the app is requesting access to their calendar data.

**Name:** Privacy - Calendars Usage Description

Deprecated

[`NSRemindersUsageDescription`](https://developer.apple.com/documentation/bundleresources/information-property-list/nsremindersusagedescription)

A message that tells people why the app is requesting access to their reminders.

**Name:** Privacy - Reminders Usage Description

Deprecated

## [See Also](https://developer.apple.com/documentation/bundleresources/protected-resources#see-also)

### [Services](https://developer.apple.com/documentation/bundleresources/protected-resources#Services)

[API Reference
Data and storage](https://developer.apple.com/documentation/bundleresources/data-and-storage)

Regulate documents, URLs, and other kinds of data movement and storage.

[API Reference
App services](https://developer.apple.com/documentation/bundleresources/app-services)

Configure services provided by the app, like support for giving directions or using game controllers.

[API Reference
Kernel and drivers](https://developer.apple.com/documentation/bundleresources/kernel-and-drivers)

Configure device drivers provided by the app.

Current page is Protected resources