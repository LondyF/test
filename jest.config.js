module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '\\.(bmp|gif|jpg|jpeg|png|psd|svg|webp)$': '<rootDir>/jest.assetMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|@react-navigation|react-native-drawer-layout|react-native-pager-view|react-native-tab-view)/)',
  ],
  setupFiles: ['./jest.setup.js'],
};
