import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {s, vs} from 'react-native-size-matters';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import QRCode from 'react-native-qrcode-svg';

import {Prescription} from '@src/features/Prescription/prescription';
import {LabRequest} from '@src/features/Laboratory/types/laboratory';
import {INSURERS, TransactionTypes} from '@src/constants';
import {Button, Typography} from '@src/components';
import {Theme} from '@styles/styles';
import useToast from '@components/Toast/useToast';
import AES from '@helpers/AES';
import useAuthStore from '@stores/useAuthStore';
import useBiometrics from '@hooks/useBiometrics';
import useTheme from '@hooks/useTheme';
import useInternetConnection from '@hooks/useInternetConnection';
import QRHolder from '@assets/qr_holder.svg';
console.log(QRHolder);

import {
  useStartPullTransactie,
  useGetTransactionResult,
  useStartMandansaTransaction,
} from '../hooks';
import {TransactionResult, TransactionResultResponse} from '../identify';
import GenerateQRButton from '../components/generateQRButton';
import InfoSection from '../components/infoSection';
import {ToastTypes} from '@src/components/Toast/toastTypes';

const AESEncryption = new AES();

interface Props {
  route: RouteProp<
    {
      params: {
        data: Prescription | LabRequest;
        id: number;
        transactionType: TransactionTypes;
        mdsId: number;
        mdsUser: User;
      };
    },
    'params'
  >;
}

const IdentifyScreen: React.FC<Props> = ({route}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const toast = useToast();

  const {t} = useTranslation();
  const {mutateAsync} = useStartPullTransactie();
  const {mutateAsync: startMandansaTransaction} = useStartMandansaTransaction();
  const {promptBiometrics} = useBiometrics();
  const {mutateAsync: getTransactionResult} = useGetTransactionResult();
  const {isInternetReachable, checkIfConnected} = useInternetConnection();

  const user = useAuthStore(state => state.user);

  const [qrCode, setQRCode] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [qrInfo, setQRInfo] = useState({});
  const [timer, setTimer] = useState<string>('02:00');

  const interval = useRef<NodeJS.Timer>();

  const isInTabStack = navigation.getState().type === 'tab';

  const isMandansa =
    route.params?.transactionType === TransactionTypes.Mandansa;

  const userInsurance =
    INSURERS.find(
      x => x.id === (!isMandansa ? user?.vzkId : route.params.mdsUser.vzkId),
    ) ?? INSURERS[INSURERS.length - 1];

  const styles = makeStyles(theme, isInTabStack);

  var isTimerRunning: boolean = false;

  //TODO: Refactor this
  const getQRInfo = useCallback(
    (type: number) => {
      const baseInfo = {type: {type: 'QR Code'}, patient: {naam: user?.naam}};
      const data = route.params?.data as any;

      switch (type) {
        case TransactionTypes.KaartControle:
          return {
            [t('identify.type')]: {
              type: t('common.insuranceCheck'),
            },
            [t('identify.patient')]: {
              naam: user?.firstName,
            },
            [t('identify.sedula')]: {
              sedula: user?.idNummer,
            },
            [t('identify.insurance')]: {
              sedula: user?.vzkNaam,
            },
          };
        case TransactionTypes.Mandansa:
          return {
            [t('identify.type')]: {
              type: t('common.prescription'),
              id: '#' + data.recId,
            },
            [t('identify.patient')]: {
              naam: data.patNaam,
            },
            [t('identify.sedula')]: {
              sedula: data?.sedula,
            },
            [t('identify.branch')]: {
              Vestiging: data.vesNaam,
            },
            mandansa: {
              naam: user?.naam,
            },
          };
        case TransactionTypes.Recept: {
          return {
            [t('identify.type')]: {
              type: t('common.prescription'),
              id: '#' + data.recId,
            },
            [t('identify.patient')]: {
              naam: data.patNaam,
            },
            [t('identify.sedula')]: {
              sedula: data?.sedula,
            },
            [t('identify.branch')]: {
              Vestiging: data.vesNaam,
            },
            [t('identify.insurance')]: {
              sedula: user?.vzkNaam,
            },
          };
        }
        case TransactionTypes.LabAanvraag: {
          return {
            [t('identify.type')]: {
              type: t('common.labRequest'),
              id: '#' + data.avaId,
            },
            [t('identify.patient')]: {
              naam: data.patNaam,
            },
            [t('identify.sedula')]: {
              sedula: data.sedula,
            },
            [t('identify.branch')]: {
              Vestiging: data.vesNaam,
            },
            [t('identify.insurance')]: {
              sedula: user?.vzkNaam,
            },
          };
        }
        default:
          return baseInfo;
      }
    },
    [user, route.params?.data, t],
  );

  useEffect(() => {
    setQRInfo(
      getQRInfo(
        route.params?.transactionType ?? TransactionTypes.KaartControle,
      ),
    );
  }, [getQRInfo, route.params]);

  const generateQRCodePressed = async () => {
    try {
      const mdsId = route.params?.mdsId ?? 0;
      const id = (route.params && route.params.id) || 0;

      if (await promptBiometrics(true, 'Identify')) {
        let {qr, transactionId} = AESEncryption.generateQr(
          AESEncryption.generateNonce(),
          user!.apuId,
          id,
          AESEncryption.generateRandomTransactionId(),
          +!!isInternetReachable,
          (route.params && route.params.transactionType) ||
            TransactionTypes.KaartControle,
          mdsId,
          user?.device?.devId ?? 0,
        );

        !isInternetReachable &&
          toast(t('identify.generateQRWithNoInternet'), ToastTypes.INFO, 2000);

        setQRCode(qr);
        startTimer(120, transactionId);
        setShowQRCode(true);
      }
    } catch (e) {
      console.log('Error generating QR', e);
    }
  };

  const generateMDSQRCodePressed = () => {
    checkIfConnected(async () => {
      if (await promptBiometrics(true, 'Identify')) {
        const generatedId = AESEncryption.generateRandomTransactionId();
        const recId = route.params?.id ?? 0;
        const QR = `SQ:${generatedId}//${user?.apuId}//${recId}`;

        setQRCode(QR);
        startTimer(120, generatedId, true);
        setShowQRCode(true);

        await startMandansaTransaction({
          apuId: user!.apuId,
          uuId: generatedId,
          recId,
        });
      }
    });
  };

  const startTimer = (
    duration: number,
    transactionId: number,
    isMandansaQR: boolean = false,
  ) => {
    let timeLeft = duration;
    let minutes;
    let seconds;
    const id = setInterval(function () {
      isTimerRunning = true;
      minutes = Math.trunc(timeLeft / 60);
      seconds = Math.trunc(timeLeft % 60);

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      setTimer(`${minutes}:${seconds}`);
      pullTransaction(transactionId, isMandansaQR);

      if (--timeLeft < 0) {
        isTimerRunning = false;
        stopTimer();
        timeLeft = duration;
      }
    }, 1000);
    interval.current = id;
  };

  const pullTransaction = async (
    transactionId: number,
    isMandansaQR: boolean = false,
  ) => {
    if (!isInternetReachable) {
      return;
    }

    var {transaktie} = await mutateAsync({
      apuId: user!.apuId,
      uuId: transactionId,
    });

    var foundTransaction = transaktie?.trnid != null;
    if (!foundTransaction) {
      return;
    }

    stopTimer();

    var response = await getTransactionResult(transaktie.trnid);
    if (response) {
      isMandansaQR
        ? handleMandansaTransactionResult(response.trnResult)
        : handleTransactionResult(response);
    }
  };

  const handleTransactionResult = (result: TransactionResultResponse) => {
    const isSuccess = result.status.status === 0;

    if (isSuccess) {
      navigation.navigate('TransactionResult', {
        result: {...result.trnResult, vzkId: result.vzkId},
      });
    }
  };

  const handleMandansaTransactionResult = (result: TransactionResult) => {
    const isSuccess = result.status.status >= 0;

    if (isSuccess) {
      const {mdsUser, mdsId} = result;

      navigation.navigate('AllMandansas', {
        screen: 'AllMandansa',
        params: {mdsUser, mdsId},
      });
    }
  };

  const stopTimer = useCallback(() => {
    setShowQRCode(false);
    clearInterval(interval.current!);
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      stopTimer();
    });

    return unsubscribe;
  }, [interval, isTimerRunning, navigation, stopTimer]);

  return (
    <View style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={[styles.flex, styles.container]}>
          {isInTabStack && (
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>{t('identify.identify')}</Text>
            </View>
          )}
          <View style={styles.midSection}>
            <View style={styles.qrCodeHolderWrapper}>
              <QRHolder width={200} height={200} />
              <View style={styles.qrCodeContainer}>
                {showQRCode ? (
                  <QRCode size={160} value={qrCode} />
                ) : (
                  <GenerateQRButton
                    onPress={() =>
                      route.params?.transactionType ===
                      TransactionTypes.PermanenteTikkie
                        ? generateMDSQRCodePressed()
                        : generateQRCodePressed()
                    }
                  />
                )}
              </View>
            </View>
            <View>
              {showQRCode ? (
                <>
                  <Typography
                    variant="b1"
                    align="center"
                    fontWeight="bold"
                    text={t('identify.qrAvailableFor')}
                  />
                  <Typography
                    variant="b1"
                    color="#980A0A"
                    align="center"
                    fontWeight="bold"
                    fontStyle="italic"
                    text={timer}
                  />
                  <TouchableOpacity onPress={stopTimer}>
                    <Typography
                      variant="b1"
                      color="#980A0A"
                      align="center"
                      fontWeight="bold"
                      fontStyle="italic"
                      text={t('identify.cancel')}
                      textStyle={styles.cancelButton}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Typography
                    variant="b1"
                    align="center"
                    fontWeight="bold"
                    text={t('identify.pressQRIcon')}
                  />
                  {route.params?.transactionType === TransactionTypes.Recept &&
                    route.params?.id > 0 && (
                      <Button
                        onPress={generateMDSQRCodePressed}
                        textStyle={styles.mandansaQRButton}
                        variant="transparent"
                        text={t('identify.generateMadansaQR')}
                      />
                    )}
                </>
              )}
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

const makeStyles = (theme: Theme, isTab: boolean) =>
  StyleSheet.create({
    flex: {
      flex: 1,
      backgroundColor: 'white',
    },
    container: {
      paddingHorizontal: 50,
      marginTop: isTab ? 0 : -60,
    },
    textStyle: {
      fontSize: 14,
      fontWeight: 'bold',
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
    qrCode: {
      width: s(150),
      height: vs(150),
      resizeMode: 'contain',
    },
    headerContainer: {
      flex: 0.15,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: 'bold',
    },
    cancelButton: {
      marginTop: 15,
    },
    mandansaQRButton: {
      color: theme.colors.primary,
      textAlign: 'center',
    },
    banner: {
      resizeMode: 'contain',
      width: '100%',
      flex: 1,
    },
    bannerContainer: {
      flex: 0.1,
      paddingBottom: !isTab ? 20 : 0,
      marginBottom: !isTab ? 0 : -6,
    },
  });

export default IdentifyScreen;
