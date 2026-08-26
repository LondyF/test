import React, {useCallback, useRef} from 'react';
import {
  Alert,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import {useTranslation} from 'react-i18next';

import SecureStorage from '@helpers/secureStorage';
import Config from '@src/config';

const useActivateTestMode = (numTapsToActivate = 7) => {
  const {t} = useTranslation();
  const tapCountRef = useRef(0);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePress = useCallback(async () => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    tapCountRef.current += 1;

    resetTimeoutRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 1500);

    if (tapCountRef.current < numTapsToActivate) {
      return;
    }

    tapCountRef.current = 0;

    const testModeURL = t('negatief.testModeURL');

    await SecureStorage.setItem(Config.TEST_MODE_STORAGE_KEY, testModeURL);

    Alert.alert(
      'Success',
      `Succeesfully entered Developer mode! All APIs will be made using ${testModeURL} as URL`,
    );
  }, [numTapsToActivate, t]);

  const activateTestModeWrapper = useCallback(
    ({
      children,
      style,
    }: {
      children: React.ReactNode;
      style?: StyleProp<ViewStyle>;
    }) => {
      return (
        <Pressable
          onPress={handlePress}
          collapsable={false}
          style={[styles.pressable, style]}>
          {children}
        </Pressable>
      );
    },
    [handlePress],
  );

  return {ActivateTestModeWrapper: React.memo(activateTestModeWrapper)};
};

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
});

export default useActivateTestMode;
