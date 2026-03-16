plugins {

    alias(libs.plugins.android.library)
    alias(libs.plugins.jetbrains.kotlin.android)
    alias(libs.plugins.compose.compiler)
    id("com.google.devtools.ksp") version "2.3.6"
    kotlin("plugin.serialization") version "2.3.20"

    `maven-publish`
}



publishing {
    publications {
        register<MavenPublication>("release") {
            groupId = "lynxpo.core"
            artifactId = "core"
            version = "1.0.24"

            // Use the Android component instead of Java
            afterEvaluate {
                from(components["release"])
            }
        }
    }
}

dependencies {
    api(libs.commons.math3)
    implementation(libs.guava)
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.appcompat)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)

    // Lynx dependencies
    implementation(libs.lynx)
    implementation(libs.lynx.jssdk)
    implementation(libs.lynx.trace)

    implementation(libs.lynx.service.log)
    implementation(libs.lynx.service.http)
    implementation(libs.lynx.service.image)

    implementation(libs.primjs)
    implementation(libs.fresco)
    implementation(libs.animated.gif)
    implementation(libs.animated.webp)
    implementation(libs.webpsupport)
    implementation(libs.animated.base)
    implementation(libs.okhttp)

    // Lynxpo dependencies
    implementation(libs.dagger.compiler)
    ksp(libs.dagger.compiler)
    implementation(libs.kotlinx.serialization.json)
    implementation(kotlin("reflect"))
    implementation(libs.ktts.plugin)
    ksp(libs.ktts.plugin)

}

// Specify Java compatibility within the Android block
android {
    compileSdk = 35
    namespace = "lynxpo.core"

    // Add other necessary Android configuration
    defaultConfig {
        minSdk = 24 // Define appropriate minimum SDK
        // consumerProguardFiles("consumer-rules.pro")
    }

    // This is required for publishing Android libraries
    publishing {
        singleVariant("release") {
            withSourcesJar()
            withJavadocJar()
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }
    kotlin {
        jvmToolchain(21)
    }

    testOptions {
        unitTests.all {
            it.useJUnitPlatform()
        }
    }

}