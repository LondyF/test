import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {
  Onfido,
  OnfidoCaptureType,
  OnfidoCountryCode,
  OnfidoDocumentType,
  OnfidoTheme,
  OnfidoError,
} from '@onfido/react-native-sdk';
import {useTranslation} from 'react-i18next';

import {Button, Typography} from '@src/components';

import useFetchOnfidoSDKToken from '../../hooks/useFetchOnfidoSDKToken';
import useStartOnfidoChecks from '../../hooks/useStartOnfidoChecks';

import {Action, ActionKind, Steps} from '../register.screen';

type Props = {
  apuId: number;
  langauge: string;
  dispatch: React.Dispatch<Action>;
};

const OnfidoDocumentVerification: React.FC<Props> = ({apuId, dispatch}) => {
  const {t} = useTranslation();

  const {data} = useFetchOnfidoSDKToken(apuId);
  const {mutate: startOnfidoCheck, isPending} = useStartOnfidoChecks();

  const handleStartOnfidoSDK = async () => {
    try {
      await Onfido.start({
        sdkToken: data?.sdk_token,
        theme: OnfidoTheme.AUTOMATIC,
        flowSteps: {
          welcome: true,
          captureFace: {
            showIntro: true,
            type: OnfidoCaptureType.PHOTO,
          },
          captureDocument: {
            countryCode: OnfidoCountryCode.CUW,
            docType: OnfidoDocumentType.NATIONAL_IDENTITY_CARD,
          },
        },
      });

      startOnfidoCheck(apuId, {
        onSuccess: () => {
          dispatch({
            type: ActionKind.SET_STEP,
            payload: Steps.SetPin,
          });
        },
        onError: error => {
          // Rethrow the error to be handled by outer catch
          throw error;
        },
      });
    } catch (error) {
      console.error('Onfido error:', error);

      if (
        (error as OnfidoError).code === 'config_error' ||
        (error as OnfidoError).code === 'userExit'
      ) {
        return;
      }

      Alert.alert('Oops!', 'Something went wrong, please try again later');
    }
  };

  return (
    <View style={styles.container}>
      <Typography
        text={t('register.onfidoTitle')}
        variant="b1"
        fontWeight="bold"
        align="center"
        color="white"
      />
      <Button
        onPress={handleStartOnfidoSDK}
        variant="secondary"
        text={t('register.onfidoStartButton')}
        buttonStyle={styles.button}
        loading={isPending}
      />
      <Button
        onPress={() =>
          dispatch({
            type: ActionKind.SET_STEP,
            payload: Steps.SetPin,
          })
        }
        variant="transparent"
        text={t('register.onfidoSkip')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 50,
  },
  button: {
    alignSelf: 'stretch',
  },
});

export default OnfidoDocumentVerification;
