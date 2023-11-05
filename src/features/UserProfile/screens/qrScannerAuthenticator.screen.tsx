import React, {useCallback, useState} from 'react';

import {BarCodeReadEvent} from 'react-native-camera';

import {ScanQRCodeModal} from '@src/components';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';

import useAuthStore from '@stores/useAuthStore';
import useToast from '@components/Toast/useToast';
import {ToastTypes} from '@components/Toast/toastTypes';

import useAuthUserWithQR from '../hooks/useAuthUserWithQR';

interface QRScannerAuthenticatorProps {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<{params: {currentSelectedTab: string}}, 'params'>;
}

const QRScannerAuthenticatorScreen: React.FC<QRScannerAuthenticatorProps> = ({
  navigation,
  route,
}) => {
  const user = useAuthStore(state => state.user);
  const toast = useToast();

  const [isScanning, setIsScanning] = useState<boolean>(true);
  const {mutateAsync: authUserWithQR} = useAuthUserWithQR();

  const navigateBackToPreviousTab = useCallback(() => {
    const previousTab = route.params?.currentSelectedTab ?? 'Home';

    navigation.navigate(previousTab);
  }, [route, navigation]);

  const handleOnScan = useCallback(
    async (e: BarCodeReadEvent) => {
      try {
        const {
          readQR: {
            status: {msg},
          },
        } = await authUserWithQR({
          apuId: user?.apuId!,
          qr: String(e.data),
        });

        toast(msg, ToastTypes.SUCCESS);
      } catch (error: any) {
        toast(
          error?.response?.status.msg ?? "couldn't authenticate you",
          ToastTypes.ERROR,
        );
      } finally {
        navigateBackToPreviousTab();
        setIsScanning(false);
      }
    },
    [authUserWithQR, toast, navigateBackToPreviousTab, user?.apuId],
  );

  const handleOnCancel = useCallback(() => {
    navigateBackToPreviousTab();
    setIsScanning(false);
  }, [navigateBackToPreviousTab]);

  return (
    <ScanQRCodeModal
      isVisisble={isScanning}
      onScan={handleOnScan}
      onCancel={handleOnCancel}
    />
  );
};

export default QRScannerAuthenticatorScreen;
