import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AppState, AppStateStatus, Image, StyleSheet, View} from 'react-native';

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

import QRHolder from '@assets/qr_holder.svg';
import InfoSection from '@src/features/Identify/components/infoSection';
import {INSURERS} from '@src/constants';
import AES from '@helpers/AES';
import useAuthStore from '@stores/useAuthStore';
import useBiometrics from '@hooks/useBiometrics';
import useTheme from '@hooks/useTheme';
import {useTranslation} from 'react-i18next';

const AESEncryption = new AES();

const DigitalSignatureScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {promptBiometrics} = useBiometrics();
  const user = useAuthStore(state => state.user);

  const [qrCode, setQRCode] = useState('');
  const appState = useRef(AppState.currentState);
  const isFocused = useRef(false);
  const requiresAuthentication = useRef(true);
  const isAuthenticating = useRef(false);

  const styles = makeStyles();

  const userInsurance =
    INSURERS.find(insurer => insurer.id === user?.vzkId) ??
    INSURERS[INSURERS.length - 1];

  const fullName = [user?.firstName, user?.naam].filter(Boolean).join(' ');

  const qrInfo: Record<string, Record<string, string>> = {
    [t('identify.patient')]: {
      naam: fullName,
    },
    [t('digitalSignature.idNumber')]: {
      idNummer: user?.idNummer ?? '',
    },
    [t('identify.insurance')]: {
      verzekeraar: user?.vzkNaam ?? '',
    },
  };

  const generateQRCode = useCallback(() => {
    if (!user?.apuId) {
      navigation.goBack();
      return;
    }

    const {qr} = AESEncryption.generateDigitalSignatureQr(user.apuId);
    setQRCode(qr);
    requiresAuthentication.current = false;
  }, [navigation, user?.apuId]);

  const authenticateAndGenerateQRCode = useCallback(async () => {
    if (isAuthenticating.current) {
      return;
    }

    isAuthenticating.current = true;

    try {
      const isAuthenticated = await promptBiometrics(
        true,
        'DigitalSignature',
        t('digitalSignature.biometricPrompt'),
      );

      if (!isAuthenticated) {
        navigation.goBack();
        return;
      }

      generateQRCode();
    } finally {
      isAuthenticating.current = false;
    }
  }, [generateQRCode, navigation, promptBiometrics, t]);

  const clearQRCode = useCallback(() => {
    setQRCode('');
    requiresAuthentication.current = true;
  }, []);

  useFocusEffect(
    useCallback(() => {
      isFocused.current = true;

      if (requiresAuthentication.current) {
        authenticateAndGenerateQRCode();
      } else {
        generateQRCode();
      }

      return () => {
        isFocused.current = false;
        clearQRCode();
      };
    }, [
      authenticateAndGenerateQRCode,
      clearQRCode,
      generateQRCode,
    ]),
  );

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const isReturningToApp =
        appState.current.match(/inactive|background/) && nextAppState === 'active';

      appState.current = nextAppState;

      if (!isFocused.current) {
        return;
      }

      if (nextAppState.match(/inactive|background/)) {
        clearQRCode();
        return;
      }

      if (isReturningToApp && requiresAuthentication.current) {
        authenticateAndGenerateQRCode();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => subscription.remove();
  }, [authenticateAndGenerateQRCode, clearQRCode]);

  return (
    <View style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.flex, styles.container]}>
          <View style={styles.midSection}>
            <View style={styles.qrCodeHolderWrapper}>
              <QRHolder width={200} height={200} />
              <View
                accessibilityLabel={t('digitalSignature.qrAccessibilityLabel')}
                accessible={!!qrCode}
                style={styles.qrCodeContainer}>
                {!!qrCode && <QRCode size={160} value={qrCode} />}
              </View>
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <InfoSection theme={theme} infoData={qrInfo} />
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.bannerContainer}>
        <Image style={styles.banner} source={userInsurance.banner} />
      </View>
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: 'white',
    },
    container: {
      paddingHorizontal: 50,
      marginTop: -60,
    },
    bottomContainer: {
      flex: 0.4,
      alignItems: 'center',
    },
    midSection: {
      flex: 1,
      alignItems: 'center',
    },
    qrCodeContainer: {
      position: 'absolute',
    },
    qrCodeHolderWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 0.85,
    },
    banner: {
      resizeMode: 'contain',
      width: '100%',
      flex: 1,
    },
    bannerContainer: {
      flex: 0.1,
      paddingBottom: 20,
    },
  });

export default DigitalSignatureScreen;
