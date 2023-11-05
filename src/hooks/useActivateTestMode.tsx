import React, {useCallback, useMemo, useRef} from 'react';
import {Alert, View} from 'react-native';

import {useTranslation} from 'react-i18next';

import {
  HandlerStateChangeEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';

import SecureStorage from '@helpers/secureStorage';
import Config from '@src/config';

const useActivateTestMode = (numTapsToActivate = 7) => {
  const {t} = useTranslation();
  const tapsRef = useRef(null);

  const onHandlerStateChange = useCallback(
    async (event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        const testModeURL = t('negatief.testModeURL');

        await SecureStorage.setItem(Config.TEST_MODE_STORAGE_KEY, testModeURL);

        Alert.alert(
          'Success',
          `Succeesfully entered Developer mode! All APIs will be made using ${testModeURL} as URL`,
        );
      }
    },
    [t],
  );

  const activateTestModeWrapper = useCallback(
    ({children}: {children: React.ReactNode}) => {
      return (
        <TapGestureHandler
          ref={tapsRef}
          numberOfTaps={numTapsToActivate}
          onHandlerStateChange={onHandlerStateChange}>
          <View>{children}</View>
        </TapGestureHandler>
      );
    },
    [numTapsToActivate, onHandlerStateChange],
  );

  return {ActivateTestModeWrapper: React.memo(activateTestModeWrapper)};
};

export default useActivateTestMode;
