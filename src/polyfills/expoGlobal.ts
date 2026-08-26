const {TurboModuleRegistry} = require('react-native');
const {
  installExpoGlobalPolyfill,
} = require('expo-modules-core/src/polyfill/dangerous-internal');

TurboModuleRegistry.get('ExpoModulesCore')?.installModules();

if (!globalThis.expo?.EventEmitter) {
  const installedExpoGlobal = globalThis.expo;

  delete globalThis.expo;
  installExpoGlobalPolyfill();

  globalThis.expo = {
    ...globalThis.expo,
    ...installedExpoGlobal,
    modules: installedExpoGlobal?.modules ?? globalThis.expo.modules,
    EventEmitter: installedExpoGlobal?.EventEmitter ?? globalThis.expo.EventEmitter,
    NativeModule: installedExpoGlobal?.NativeModule ?? globalThis.expo.NativeModule,
    SharedObject: installedExpoGlobal?.SharedObject ?? globalThis.expo.SharedObject,
    SharedRef: installedExpoGlobal?.SharedRef ?? globalThis.expo.SharedRef,
  };
}

require('expo/src/Expo.fx.tsx');

export {};
