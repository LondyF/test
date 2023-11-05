import React, {useEffect, useCallback} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';

import {useFormik} from 'formik';
import {faUser, faLock} from '@fortawesome/pro-solid-svg-icons';
import {s, vs} from 'react-native-size-matters';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import OneSignal from 'react-native-onesignal';

import {areObjectsSame} from '@src/utils';
import {getDeviceInfo} from '@utils/deviceInfo';
import {
  TextInput,
  Button,
  Loader,
  PageContainer,
  Typography,
} from '@components/index';
import {ValidationStatus} from '@src/types/validationStatus';
import {ToastTypes} from '@components/Toast/toastTypes';
import SecureStorage from '@helpers/secureStorage';
import AuthToken from '@helpers/authCreds';
import useToast from '@components/Toast/useToast';
import useAuthStore from '@stores/useAuthStore';
import usePin from '@hooks/usePin';
import useBiometrics from '@hooks/useBiometrics';
import useInternetConnection from '@hooks/useInternetConnection';
import useGenericPopUpStore from '@stores/useGenericPopUpStore';

import useLoginUser from '../hooks/useLoginUser';
import useResetPassword from '../hooks/useResetPassword';

import useActivateTestMode from '@hooks/useActivateTestMode';

const LoginScreen: React.FC = () => {
  const {t} = useTranslation();
  const Toast = useToast();
  const storePopUpProps = useGenericPopUpStore(state => state.setPopUpProps);
  const [storedUser, storeAuthenticatedUser, hasRecentlyLoggedOut] =
    useAuthStore(
      state => [
        state.user,
        state.storeAuthenticatedUser,
        state.recentlyLoggedOut,
      ],
      (oldStore, newStore) => areObjectsSame(oldStore[0], newStore[0]),
    );
  const {authenticateUser} = usePin(storedUser?.pin ?? '');
  const {promptBiometrics} = useBiometrics();
  const {isInternetReachable} = useInternetConnection();
  const {mutate, status, error, data, isLoading} = useLoginUser();
  const {
    mutate: resetPassword,
    error: resetPasswordError,
    status: resetPasswordStatus,
    isLoading: isSendingResetPasswordMail,
    data: resetPasswordData,
  } = useResetPassword();

  const {handleChange, handleSubmit, values, setFieldValue} = useFormik({
    initialValues: {
      email: storedUser?.account,
      password: '',
      biometricPassword: '',
    },
    onSubmit: async ({email, password, biometricPassword}) => {
      return mutate({
        email,
        password,
        biometricPassword,
        device: await getDeviceInfo(),
      });
    },
  });

  const {ActivateTestModeWrapper} = useActivateTestMode();

  const loginUserWithBiometrics = useCallback(
    async () => {
      try {
        if (await promptBiometrics()) {
          setFieldValue('biometricPassword', storedUser?.biometricPassword);
          handleSubmit();
        }
      } catch (e) {
        console.log(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setFieldValue, handleSubmit, promptBiometrics],
  );

  const loginOfflineMode = async () => {
    try {
      if (await promptBiometrics(true)) {
        storeAuthenticatedUser({...storedUser});
        Toast(t('login.loggedInOffline'), ToastTypes.WARNING);
      } else {
        Alert.alert('Oops!', t('login.failedAuthenticatingOffline'));
      }
    } catch (e) {
      Alert.alert('Oops!', 'Something Went Wrong');
    }
  };

  useEffect(() => {
    if (isInternetReachable && !hasRecentlyLoggedOut) {
      loginUserWithBiometrics();
    }
  }, [loginUserWithBiometrics, isInternetReachable, hasRecentlyLoggedOut]);

  const storeUserInSecureStorage = useCallback(
    async (user: User) => {
      let userToStore = {
        ...storedUser,
        ...user,
      };

      await SecureStorage.setItem('user', JSON.stringify(userToStore));
    },
    [storedUser],
  );

  useEffect(() => {
    (async function () {
      if (status === 'success') {
        const authenticatedUser = data.access.apuuser as User;
        const creds = data.access.auth;
        const device = data.access.device;
        const popUp = data.access.message;
        const hasToShowPopUp = popUp.popupType !== 0;

        const validationPhotoNeeded =
          authenticatedUser.validationStatus ===
          ValidationStatus.VALIDATION_PHOTO_NEEDED;

        const toastText = validationPhotoNeeded
          ? 'Extra action needed'
          : 'Successfully logged in!';
        const toastType = validationPhotoNeeded
          ? ToastTypes.WARNING
          : ToastTypes.SUCCESS;

        await AuthToken.storeAuthCreds(creds);

        OneSignal.setExternalUserId(String(authenticatedUser.apuId));

        storeAuthenticatedUser({...authenticatedUser, device});
        storeUserInSecureStorage(authenticatedUser);

        if (hasToShowPopUp) {
          storePopUpProps({
            popUpTitle: popUp.header,
            popUpBody: popUp.alinea1,
            popUpBodyTwo: popUp.alinea2,
            buttonType: popUp.buttonType,
            popUpType: popUp.popupType === 1 ? 'WARNING' : 'INFO',
            isPopUpVisible: true,
          });
        }

        Toast(toastText, toastType);
      } else if (status === 'error') {
        const responseStatus = error?.response?.data?.access?.status;

        Alert.alert('Oops!', responseStatus?.msg ?? 'Er ging iets mis');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, storeAuthenticatedUser, status, Toast]);

  useEffect(() => {
    if (resetPasswordStatus === 'success') {
      const msg = resetPasswordData?.access?.status?.msg;

      Alert.alert(t('common.success'), msg);
    }

    if (resetPasswordStatus === 'error') {
      const msg =
        resetPasswordError?.response?.data?.access?.status.msg ??
        'Something went wrong';
      Alert.alert(t('common.Failed'), msg);
    }
  }, [resetPasswordStatus, resetPasswordError, resetPasswordData, t]);

  const authenticateUserWithPin = async () => {
    try {
      await authenticateUser();

      setFieldValue('biometricPassword', storedUser?.biometricPassword);
      handleSubmit();
    } catch {
      Alert.alert('Oops', t('login.cantAuthenticatePin'));
    }
  };

  const promptSendForgotPasswordMail = () => {
    Alert.alert(t('common.areYouSure'), t('login.changePasswordExplanation'), [
      {
        text: t('common.continue'),
        onPress: () => resetPassword({apuId: storedUser?.apuId}),
      },
      {
        text: t('common.cancel'),
        onPress: () => null,
      },
    ]);
  };

  return (
    <PageContainer variant="blue">
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <ActivateTestModeWrapper>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={require('@assets/logo_wit.png')}
              />
            </View>
          </ActivateTestModeWrapper>
          <Text style={styles.welcomeText}>{t('login.welcomeBack')}</Text>
        </View>
        <View style={styles.fill}>
          {isLoading || isSendingResetPasswordMail ? (
            <Loader
              containerStyle={styles.loader}
              text={
                isSendingResetPasswordMail
                  ? t('login.sendingResetPasswordMail')
                  : t('login.loading')
              }
            />
          ) : (
            <>
              {isInternetReachable ? (
                <>
                  <View style={styles.inputContainer}>
                    <TextInput
                      label={t('login.user')}
                      mainColor="white"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      icon={faUser}
                      disabled={!__DEV__}
                      autoCapitalize="none"
                    />
                    <TextInput
                      label={t('login.password')}
                      mainColor="white"
                      secureTextEntry={true}
                      icon={faLock}
                      onChangeText={handleChange('password')}
                      contextMenuHidden={false}
                    />
                    <TouchableOpacity onPress={promptSendForgotPasswordMail}>
                      <Typography
                        text={t('login.forgotPassword')}
                        color="white"
                        variant="b1"
                        align="right"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.formFooter}>
                    <Button
                      buttonStyle={styles.buttonStyle}
                      variant="secondary"
                      text={t('login.login')}
                      onPress={() => {
                        setFieldValue('biometricPassword', '');
                        handleSubmit();
                      }}
                    />
                    <Text style={styles.white}>{t('login.or')}</Text>
                    <TouchableOpacity onPress={authenticateUserWithPin}>
                      <Text style={styles.white}>
                        {t('login.authenticatieWithPin')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.offlineModeContainer}>
                  <Typography
                    variant="b1"
                    fontWeight="bold"
                    color="white"
                    align="center"
                    text={t('login.noInternet')}
                    textStyle={styles.noConnectionText}
                  />
                  <Button
                    buttonStyle={styles.buttonStyle}
                    variant="secondary"
                    text={t('login.loginOfflineModus')}
                    onPress={loginOfflineMode}
                  />
                </View>
              )}
            </>
          )}
        </View>
      </KeyboardAwareScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
  offlineModeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  header: {
    flex: 0.35,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    height: vs(80),
    width: s(200),
    resizeMode: 'contain',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginTop: -150,
  },
  welcomeText: {
    color: 'white',
    fontSize: s(28),
  },
  fill: {
    flex: 1,
  },
  inputContainer: {
    flex: 0.6,
    justifyContent: 'center',
  },
  formFooter: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonStyle: {
    alignSelf: 'stretch',
  },
  white: {
    color: 'white',
  },
  noConnectionText: {
    marginBottom: 50,
  },
});

export default LoginScreen;
