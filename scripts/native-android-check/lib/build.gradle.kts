plugins {
    id("com.android.library")
}

val modulesDir = rootProject.file("../../packages/modules")
val nativeSources = modulesDir.listFiles()
    ?.filter { it.isDirectory && it.resolve("android/src/main/java").isDirectory }
    ?.map { it.resolve("android/src/main/java") }
    ?.sortedBy { it.path }
    .orEmpty()

android {
    namespace = "lynxpo.nativecheck"
    compileSdk = 37

    defaultConfig {
        minSdk = 24
    }

    sourceSets {
        getByName("main") {
            java.srcDirs(nativeSources.map { it.absolutePath })
            kotlin.srcDirs(nativeSources.map { it.absolutePath })
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }
}

dependencies {
    implementation("org.lynxsdk.lynx:lynx:4.2.0")
    implementation("androidx.annotation:annotation:1.11.0")
    implementation("androidx.core:core:1.19.1")
    implementation("androidx.appcompat:appcompat:1.8.0")
    implementation("com.facebook.device.yearclass:yearclass:2.1.0")
}
