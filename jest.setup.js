/* eslint-env jest */

jest.mock('react-native', () => {
  const ReactNative = jest.requireActual('react-native');

  Object.defineProperty(ReactNative, 'BackHandler', {
    configurable: true,
    value: {
      addEventListener: jest.fn(() => ({
        remove: jest.fn(),
      })),
      removeEventListener: jest.fn(),
    },
  });

  return ReactNative;
});

jest.mock('expo-splash-screen', () => ({
  hideAsync: jest.fn(() => Promise.resolve()),
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-i18next', () => ({
  initReactI18next: {
    init: jest.fn(),
    type: '3rdParty',
  },
  useTranslation: () => ({
    i18n: {
      changeLanguage: jest.fn(),
    },
    ready: true,
    t: key => key,
  }),
}));

jest.mock('@services/i18n', () => ({}));

jest.mock('react-native-onesignal', () => ({
  OneSignal: {
    Debug: {
      setLogLevel: jest.fn(),
    },
    Notifications: {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      requestPermission: jest.fn(),
    },
    initialize: jest.fn(),
    login: jest.fn(),
  },
}));

jest.mock('@fortawesome/react-native-fontawesome', () => {
  const React = require('react');

  return {
    FontAwesomeIcon: props => React.createElement('FontAwesomeIcon', props),
  };
});

jest.mock('react-native-picker-select', () => {
  const React = require('react');

  return props => React.createElement('RNPickerSelect', props);
});

jest.mock('react-native-keychain', () => ({
  ACCESSIBLE: {
    AFTER_FIRST_UNLOCK: 'AccessibleAfterFirstUnlock',
  },
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('react-native-fs', () => ({
  DocumentDirectoryPath: '/tmp',
  exists: jest.fn(() => Promise.resolve(false)),
  readFile: jest.fn(() => Promise.resolve('')),
  writeFile: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-quick-crypto', () => {
  const crypto = require('crypto');
  const {Buffer} = require('buffer');

  return {
    ...crypto,
    Buffer,
  };
});

jest.mock(
  '@react-native-async-storage/async-storage',
  () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-modal', () => {
  const React = require('react');

  return ({children, ...props}) =>
    React.createElement('ReactNativeModal', props, children);
});

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const {View} = require('react-native');

  return {
    __esModule: true,
    default: {
      View,
      addWhitelistedNativeProps: jest.fn(),
      addWhitelistedUIProps: jest.fn(),
      createAnimatedComponent: component => component,
      call: jest.fn(),
    },
    Easing: {
      linear: jest.fn(),
      out: jest.fn(easing => easing),
    },
    Extrapolate: {
      CLAMP: 'clamp',
    },
    interpolate: jest.fn(),
    runOnJS: fn => fn,
    useAnimatedStyle: jest.fn(() => ({})),
    useDerivedValue: jest.fn(factory => ({value: factory()})),
    useSharedValue: jest.fn(value => ({value})),
    withSpring: jest.fn(value => value),
    withTiming: jest.fn(value => value),
    View: props => React.createElement(View, props),
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const {View} = require('react-native');

  return {
    DrawerLayout: props => React.createElement(View, props),
    FlatList: require('react-native').FlatList,
    GestureHandlerRootView: props => React.createElement(View, props),
    NativeViewGestureHandler: props => React.createElement(View, props),
    PanGestureHandler: props => React.createElement(View, props),
    RectButton: props => React.createElement(View, props),
    ScrollView: require('react-native').ScrollView,
    State: {},
    Swipeable: props => React.createElement(View, props),
    TouchableOpacity: require('react-native').TouchableOpacity,
    gestureHandlerRootHOC: component => component,
  };
});

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(() =>
    Promise.resolve({
      isConnected: true,
      isInternetReachable: true,
    }),
  ),
}));

jest.mock('react-native-device-info', () => ({
  getBuildNumber: jest.fn(() => '1'),
  getDeviceId: jest.fn(() => 'jest-device'),
  getDeviceName: jest.fn(() => Promise.resolve('Jest Device')),
  getSystemName: jest.fn(() => 'jest'),
  getSystemVersion: jest.fn(() => '1.0'),
  getUniqueId: jest.fn(() => Promise.resolve('jest-unique-id')),
}));

jest.mock('react-native-image-picker', () => ({
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
}));

jest.mock('@onfido/react-native-sdk', () => ({
  __esModule: true,
  default: {
    start: jest.fn(() => Promise.resolve()),
  },
  Onfido: {
    start: jest.fn(() => Promise.resolve()),
  },
  OnfidoCaptureType: {
    PHOTO: 'PHOTO',
  },
  OnfidoCountryCode: {
    CUW: 'CUW',
  },
  OnfidoDocumentType: {
    NATIONAL_IDENTITY_CARD: 'NATIONAL_IDENTITY_CARD',
  },
  OnfidoTheme: {
    AUTOMATIC: 'AUTOMATIC',
  },
}));

jest.mock('react-native-size-matters', () => ({
  ScaledSheet: {
    create: styles => styles,
  },
  ms: value => value,
  s: value => value,
  scale: value => value,
  verticalScale: value => value,
  vs: value => value,
}));

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const React = require('react');
  const {ScrollView} = require('react-native');

  return {
    KeyboardAwareScrollView: props => React.createElement(ScrollView, props),
  };
});

jest.mock('react-native-permissions', () => ({
  PERMISSIONS: {
    ANDROID: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
      CAMERA: 'android.permission.CAMERA',
    },
    IOS: {
      CAMERA: 'ios.permission.CAMERA',
      FACE_ID: 'ios.permission.FACE_ID',
      LOCATION_ALWAYS: 'ios.permission.LOCATION_ALWAYS',
    },
  },
  RESULTS: {
    BLOCKED: 'blocked',
    DENIED: 'denied',
    GRANTED: 'granted',
    LIMITED: 'limited',
    UNAVAILABLE: 'unavailable',
  },
  check: jest.fn(() => Promise.resolve('granted')),
  request: jest.fn(() => Promise.resolve('granted')),
}));

jest.mock('react-native-biometrics', () => {
  return {
    __esModule: true,
    BiometryTypes: {
      FaceID: 'FaceID',
    },
    default: jest.fn().mockImplementation(() => ({
      isSensorAvailable: jest.fn(() =>
        Promise.resolve({
          available: false,
          biometryType: undefined,
        }),
      ),
      simplePrompt: jest.fn(() => Promise.resolve({success: true})),
    })),
  };
});

jest.mock('react-native-linear-gradient', () => {
  const React = require('react');
  const {View} = require('react-native');

  return props => React.createElement(View, props);
});

jest.mock('react-native-date-picker', () => {
  const React = require('react');

  return props => React.createElement('DatePicker', props);
});

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const {View} = require('react-native');

  return {
    BottomSheetBackdrop: props => React.createElement(View, props),
    BottomSheetModal: React.forwardRef(({children, ...props}, ref) =>
      React.createElement(View, {...props, ref}, children),
    ),
    BottomSheetModalProvider: ({children}) =>
      React.createElement(React.Fragment, null, children),
    BottomSheetScrollView: props => React.createElement(View, props),
  };
});

jest.mock('react-native-calendar-strip', () => {
  const React = require('react');

  return props => React.createElement('CalendarStrip', props);
});

jest.mock('react-native-calendars', () => {
  const React = require('react');

  return {
    Calendar: props => React.createElement('Calendar', props),
    CalendarList: props => React.createElement('CalendarList', props),
  };
});

jest.mock('react-native-geolocation-service', () => ({
  __esModule: true,
  default: {
    clearWatch: jest.fn(),
    getCurrentPosition: jest.fn(success =>
      success({
        coords: {
          latitude: 0,
          longitude: 0,
        },
      }),
    ),
    watchPosition: jest.fn(() => 1),
  },
}));

jest.mock('react-native-qrcode-svg', () => {
  const React = require('react');

  return props => React.createElement('QRCode', props);
});

jest.mock('react-native-maps', () => {
  const React = require('react');
  const {View} = require('react-native');
  const MapView = props => React.createElement(View, props);

  return {
    __esModule: true,
    default: MapView,
    Marker: props => React.createElement(View, props),
    Polyline: props => React.createElement(View, props),
  };
});

jest.mock('expo-file-system', () => ({
  copyAsync: jest.fn(() => Promise.resolve()),
  documentDirectory: 'file:///tmp/',
  getInfoAsync: jest.fn(() => Promise.resolve({exists: false})),
  makeDirectoryAsync: jest.fn(() => Promise.resolve()),
  moveAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-sqlite', () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(),
  })),
}));

jest.mock('expo-camera', () => {
  const React = require('react');

  return {
    CameraView: props => React.createElement('CameraView', props),
    useCameraPermissions: jest.fn(() => [
      {granted: true},
      jest.fn(() => Promise.resolve({granted: true})),
    ]),
  };
});
