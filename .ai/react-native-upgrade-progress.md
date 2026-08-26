# React Native Upgrade Progress

Last updated: 2026-06-21

## Phase Checklist

- [x] Phase 0: Baseline and reproducibility
- [x] Phase 1: Replace known unsupported packages before React Native bumps
- [x] Phase 2: Incremental Expo/RN upgrades through Legacy Architecture
- [x] Phase 3: New Architecture bring-up
- [x] Phase 4: Final target upgrade to Expo SDK 56 / React Native 0.85
- [ ] Phase 5: Release hardening

## Current Snapshot

- React Native: `0.85.3`
- React: `19.2.3`
- Expo SDK: `~56.0.0`
- Workflow: bare React Native with Expo Modules
- Package manager: Yarn v1
- Hermes: enabled
- New Architecture: enabled (`RCT_NEW_ARCH_ENABLED=1`)
- Android min SDK: `24`
- iOS deployment target: `16.4`
- CocoaPods: run through Bundler

## Recent iOS Launch Fixes

- Switched the app delegate launch path to Expo's `EXReactNativeFactory` so Expo modules register during React Native runtime initialization.
- Added `RCTAppDependencyProvider` wiring required by React Native 0.85 New Architecture.
- Restored the debug bundle root to `index` and added `sourceURLForBridge:` so both RN factory paths receive the Metro URL.
- Added `src/polyfills/expoGlobal.ts` as a narrow Expo bootstrap guard before `expo/src/Expo.fx.tsx`.
- Regenerated pods/codegen after stale generated module providers caused `RNDatePickerManager does not conform to RCTModuleProvider`.

Verified on 2026-06-21:

- [x] `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 bundle exec pod install`
- [x] `yarn ios --udid 4EDB2741-400F-4E14-A177-B54BD32F147A`
- [x] iOS app reached the MiSalu welcome screen after dismissing the notification prompt.

## Current Patch Set

The patch set was cleaned on 2026-06-21 to remove generated Android/iOS build outputs and local absolute paths.

Required for the current upgrade state:

- `patches/expo-modules-jsi+56.0.9.patch`
  - Removes `s.static_framework = true` so CocoaPods embeds `ExpoModulesJSI.framework`.
  - Adds a non-empty binary check to the xcframework cache path.
  - Applies Swift 6 concurrency annotations needed by the current Xcode/Swift toolchain.
- `patches/react-native-biometrics+3.0.1.patch`
- `patches/react-native-fs+2.20.0.patch`
- `patches/react-native-geolocation-service+5.3.1.patch`
- `patches/react-native-linear-gradient+2.8.3.patch`
- `patches/react-native-onesignal+5.0.2.patch`
  - Mostly Android `namespace` additions and iOS React header import fixes for older native packages.
- `patches/@onfido+react-native-sdk+14.0.0.patch`
  - Keeps the upgraded Onfido wrapper compiling against the resolved iOS SDK by removing wrapper references to unavailable Onfido SDK symbols.

Deleted as obsolete or generated-noise patches:

- Old Node/polyfill package patches from the pre-quick-crypto setup.
- Old `react-native-camera` / splash-screen patches after migration to Expo camera and `expo-splash-screen`.
- Artifact-only Expo patch files for `expo-constants` and `expo-modules-core`.

## Reducing Patches

Preferred path:

- Upgrade or replace native packages that only need Android namespace patches:
  `react-native-biometrics`, `react-native-fs`, `react-native-geolocation-service`, `react-native-linear-gradient`, and `react-native-onesignal`.
- Re-check whether a newer Expo SDK 56 patch release or Expo SDK 57 removes the `expo-modules-jsi` fixes.
- If staying on React Native 0.85/New Architecture, keep `EXReactNativeFactory` and dependency-provider wiring rather than patching Expo JS module registration.
- If the team decides not to stabilize New Architecture in this release, disable `RCT_NEW_ARCH_ENABLED` globally and re-run pods/builds; that may remove some New Architecture-specific pressure but is a larger architecture decision.

## Phase 5 Gate

- [ ] Fresh install: delete `node_modules`, reinstall, verify `npx patch-package --error-on-fail`.
- [ ] Fresh pods: remove Pods/build artifacts, run `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 bundle exec pod install`.
- [ ] iOS debug build and simulator launch from clean state.
- [ ] Android debug build from clean state.
- [ ] `yarn test`.
- [ ] `yarn lint`.
- [ ] Smoke-test login, registration, QR scan, Onfido, maps/location, notifications, biometrics, secure storage, network requests, and SQLite/file-system paths.

## Phase 5 Verification Run: 2026-06-21

- [x] `npx patch-package --error-on-fail`
  - Applied all current patches successfully.
- [x] `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 bundle exec pod install`
  - Completed successfully; CocoaPods still reports non-blocking warnings for multiple entitlement files and OneSignal extension `CLANG_CXX_LANGUAGE_STANDARD` overrides.
- [x] `yarn test --runInBand`
  - Passed: 1 test suite, 1 test.
- [x] `yarn lint`
  - Initial run failed with 123 errors and 108 warnings.
  - Removed unused imports/variables and added the Jest env pragma to `jest.setup.js`.
  - Current run passes with warnings only.
- [x] Clean iOS build/install and Argent launch verification
  - `xcodebuild ... clean` succeeded.
  - `yarn ios --udid 4EDB2741-400F-4E14-A177-B54BD32F147A` succeeded.
  - Argent verified the app on the welcome screen and a tap on `Volgende` navigated to language selection.
- [x] Android debug build
  - Initial run failed because `JAVA_HOME` pointed at Java 11.
  - Retried with `JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home`.
  - Cleared generated CMake caches at `android/app/.cxx` and `node_modules/expo-modules-core/android/.cxx` after a corrupted `configure_fingerprint.bin`.
  - `./gradlew assembleDebug` passed with Java 17.
- [x] Android emulator install and Argent launch verification
  - Verified `emulator-5554` became authorized.
  - Configured `adb reverse tcp:8081 tcp:8081` and confirmed Metro on port 8081.
  - `yarn android --deviceId emulator-5554` built but failed at `installDebug` with emulator `INSTALL_FAILED_INSUFFICIENT_STORAGE`.
  - Direct streamed install succeeded with `adb install -r -g android/app/build/outputs/apk/debug/app-debug.apk`.
  - Argent launched `net.sqlapius.iSQSalu`, verified the settings/onboarding screen, and verified navigation into registration.
