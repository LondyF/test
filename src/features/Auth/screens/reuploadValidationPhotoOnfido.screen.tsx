import React from 'react';
import {Alert, Image, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import useAuthStore from '@src/stores/useAuthStore';
import {Button, PageContainer, Typography} from '@src/components';

import useFetchOnfidoSDKToken from '../hooks/useFetchOnfidoSDKToken';
import useStartOnfidoChecks from '../hooks/useStartOnfidoChecks';
import Onfido, {
  OnfidoCaptureType,
  OnfidoCountryCode,
  OnfidoDocumentType,
  OnfidoError,
  OnfidoTheme,
} from '@onfido/react-native-sdk';
import {ValidationStatus} from '@src/types/validationStatus';

const ReuploadValidationPhotoOnfido: React.FC = () => {
  const {t} = useTranslation();

  const [user, resetAuthentication, setAuthenticatedUser] = useAuthStore(
    state => [
      state.user,
      state.resetAuthentication,
      state.storeAuthenticatedUser,
    ],
  );

  const {data} = useFetchOnfidoSDKToken(user?.apuId);
  const {
    mutate: startOnfidoCheck,
    isSuccess,
    isPending,
  } = useStartOnfidoChecks();

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

      startOnfidoCheck(user!.apuId, {
        onSuccess: () => {},
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
    } finally {
    }
  };

  const handleContinueToApp = () => {
    setAuthenticatedUser({
      ...user,
      validationStatus: ValidationStatus.PENDING,
    });
  };

  return (
    <PageContainer variant="blue">
      {isSuccess ? (
        <View style={styles.successContainer}>
          <Image
            style={styles.successIcon}
            source={require('@assets/success_white.png')}
          />
          <Typography
            textStyle={styles.photoUploadedText}
            variant="h2"
            fontWeight="bold"
            color="white"
            text={t('reuploadValidation.photoUploaded')}
          />
          <Typography
            variant="b1"
            color="white"
            fontWeight="600"
            align="center"
            textStyle={styles.successExplainationText}
            text={t('reuploadValidation.photoUploadedSuccess')}
          />
          <Button
            buttonStyle={styles.continueButton}
            onPress={handleContinueToApp}
            variant="secondary"
            text={t('reuploadValidation.continueToApp')}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Button
            onPress={() => resetAuthentication()}
            textStyle={styles.loginButtonText}
            text="Logout"
            variant="secondary"
            style={styles.logoutButton}
          />
          <View style={styles.container}>
            <Typography
              variant="h2"
              color="white"
              text={t('reuploadValidation.uploadDocumentTitle')}
              fontWeight="bold"
              textStyle={styles.title}
            />
            <Typography
              variant="b1"
              fontWeight="600"
              textStyle={styles.rejectionExplanation}
              color="white"
              text={t('reuploadValidation.photoRejected', {
                naam: `${user?.firstName} ${user?.naam}`,
                idNumber: user?.idNummer,
              })}
            />
            <Typography
              variant="b1"
              fontWeight="600"
              color="white"
              text={t('reuploadValidation.uploadNewPictureBelow')}
            />
            <Button
              loading={isPending}
              variant="secondary"
              onPress={handleStartOnfidoSDK}
              text={t('reuploadValidation.uploadFoto')}
              buttonStyle={styles.uploadButton}
            />
          </View>
        </View>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  loginButtonText: {
    color: '#8b0000',
  },
  title: {
    marginTop: 80,
    marginBottom: 30,
  },
  rejectionExplanation: {
    marginBottom: 30,
  },
  uploadButton: {
    marginTop: 30,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    width: 200,
    height: 200,
  },
  photoUploadedText: {
    marginTop: 30,
  },
  successExplainationText: {
    marginVertical: 30,
  },
  continueButton: {
    marginBottom: 10,
  },
});

export default ReuploadValidationPhotoOnfido;
