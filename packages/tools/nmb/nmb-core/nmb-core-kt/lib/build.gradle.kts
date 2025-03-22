 plugins {
    // Apply the org.jetbrains.kotlin.jvm Plugin to add support for Kotlin.
    alias(libs.plugins.kotlin.jvm)
    
    // Apply the java-library plugin for API and implementation separation.
    `java-library`
    alias(libs.plugins.wire)
    `maven-publish`
}

repositories {
    // Use Maven Central for resolving dependencies.
    mavenCentral()
}

dependencies {
    // This dependency is exported to consumers, that is to say found on their compile classpath.
    api(libs.commons.math3)

    // This dependency is used internally, and not exposed to consumers on their own compile
    // classpath.
    implementation(libs.guava)
}

buildscript {
  repositories {
    mavenCentral()
  }
  dependencies {
    classpath(libs.wire)
  }
}

// Configure Kotlin source sets to include Wire-generated sources
sourceSets {
    main {
        kotlin {
            srcDir("build/generated/source/wire")
        }
    }
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            groupId = "nmb.core"
            artifactId = "modtyinfo"  // ARTIFACT_ID
            version = "1.0.1"
            from(components["java"])
        }
    }
    repositories {
        mavenLocal()  // Publish to ~/.m2/repository
    }
}

testing {
    suites {
        // Configure the built-in test suite
        val test by
                getting(JvmTestSuite::class) {
                    // Use Kotlin Test test framework
                    useKotlinTest("2.0.21")
                }
    }
}

apply(plugin = "com.squareup.wire")
wire {
    sourcePath {
        srcDir("../../src/protos")
        include("modtyinfo.proto")
    }
    kotlin {
        // Ensures generated code is placed properly
        out = "build/generated/source/wire"
    }
}

// Apply a specific Java toolchain to ease working on different environments.
java { toolchain { languageVersion = JavaLanguageVersion.of(21) } }
kotlin {
    jvmToolchain(21)
}