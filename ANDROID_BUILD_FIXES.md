# Android Build Fixes for AGP 8.0+ / Java 17

## Issues Fixed

### 1. Java Version Requirement

- **Problem**: Android Gradle Plugin 8.1.0 requires Java 17
- **Solution**: Set `org.gradle.java.home` in `android/gradle.properties`

```properties
org.gradle.java.home=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```

### 2. BuildConfig Feature

- **Problem**: AGP 8.0+ disabled `BuildConfig` by default
- **Solution**: Enabled in `android/app/build.gradle` and globally in `android/build.gradle` for all subprojects

### 3. Namespace Declarations

- **Problem**: AGP 8.0+ requires `namespace` in build.gradle instead of `package` in AndroidManifest.xml
- **Solution**:
  - Removed `package` attribute from `android/app/src/main/AndroidManifest.xml`
  - Added `namespace` declarations to 14+ React Native modules:
    - @onfido/react-native-sdk
    - react-native-biometrics
    - react-native-camera
    - react-native-fs
    - react-native-geolocation-service
    - react-native-linear-gradient
    - react-native-maps
    - react-native-onesignal
    - react-native-os
    - react-native-pager-view
    - react-native-randombytes
    - react-native-splash-screen
    - react-native-tcp
    - react-native-udp

### 4. Onfido SDK Fixes

- **Problem**: Missing namespace and incompatible publish.gradle
- **Solution**:
  - Added `namespace "com.onfido.reactnative.sdk"`
  - Commented out `from components.release` in publish.gradle
  - Set `buildConfig = true`

### 5. Java 17 Compatibility for Expo Modules

- **Problem**: All Expo modules were configured for Java 11, causing JVM target mismatch
- **Solution**: Updated all expo modules to Java 17:
  - expo
  - expo-application
  - expo-constants
  - expo-file-system
  - expo-font
  - expo-keep-awake
  - expo-modules-core (main module + android-annotation + android-annotation-processor)
  - expo-sqlite

### 6. Global Subprojects Configuration

- **Problem**: Need consistent Java 17 and Kotlin JVM target across all modules
- **Solution**: Added global configuration in `android/build.gradle`:

```gradle
subprojects {
    afterEvaluate { project ->
        if (project.hasProperty("android")) {
            android {
                buildFeatures {
                    buildConfig = true
                }

                compileOptions {
                    sourceCompatibility JavaVersion.VERSION_17
                    targetCompatibility JavaVersion.VERSION_17
                }
            }
        }

        tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
            kotlinOptions {
                jvmTarget = "17"
            }
        }
    }
}
```

## Files Modified

### Project Files

- `android/app/build.gradle` - Added buildFeatures
- `android/build.gradle` - Added subprojects configuration
- `android/gradle.properties` - Added Java home, Kotlin target, SDK suppression
- `android/app/src/main/AndroidManifest.xml` - Removed package attribute

### Node Modules (require re-application after npm install)

All changes to node_modules should ideally be converted to patches using patch-package:

- Multiple expo modules build.gradle files
- Multiple react-native modules build.gradle files
- Onfido SDK android/build.gradle and android/publish.gradle

## To Preserve Changes

**Important**: After running `npm install` or `yarn install`, re-apply fixes by:

1. Manually re-editing the node_modules files, OR
2. Creating proper patch files for each module using `npx patch-package <module-name>`

The patches should be stored in the `patches/` directory and will be auto-applied via the postinstall script.

## Running the Build

Always ensure Java 17 is being used:

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
npx react-native run-android
```

Or rely on the gradle.properties setting to automatically use Java 17.
