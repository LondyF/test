import React, {useReducer, useEffect, useCallback} from 'react';
import {View, StyleSheet, Alert} from 'react-native';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {BarCodeReadEvent} from 'react-native-camera';
import {useTranslation} from 'react-i18next';
import {OneSignal} from 'react-native-onesignal';

import {PageContainer, Typography, Loader} from '@components/index';
import useToast from '@components/Toast/useToast';
import {ToastTypes} from '@components/Toast/toastTypes';
import {arrayEquals} from '@src/utils';
import useFetchAllInsurers from '@hooks/useFetchAllInsurers';
import useFetchAllDoctors from '@hooks/useFetchAllDoctors';
import useRegisterUser from '@hooks/useRegisterUser';
import SecureStorage from '@helpers/secureStorage';
import AuthCreds from '@helpers/authCreds';
import useAuthStore from '@stores/useAuthStore';
import useUploadPhotoOfId from '@hooks/useUploadPhotoOfId';
import {getDeviceInfo} from '@utils/deviceInfo';
import ScanQRCodeModal from '@src/features/Mandansa/components/scanQRCodeModal';

import {
  StartStep,
  EnterLicenseManuallyStep,
  VerifyPhoneNumberStep,
  EnterPinStep,
  UploadIdStep,
  EnterPersonalInfoStep,
  EnterInsuranceInfoStep,
  EnterContactInfoStep,
} from './steps';
import ProgressTracker from '../components/progressTracker';
import Header from '../components/header';
import useValidateLicense from '../hooks/useValidateLicense';
import useValidatePhoneNumber from '../hooks/useValidatePhoneNumber';
import useCheckSedula from '../hooks/useCheckSedula';

export enum Steps {
  Start,
  EnterLicenseManually,
  VerifyPhoneNumber,
  EnterPersonalInfo,
  EnterContactInfo,
  uploadId,
  EnterInsuranceInfo,
  SetPin,
  IsBusy,
}

export enum ActionKind {
  SET_STEP = 'SET_STEP',
  SET_BUSY = 'SET_BUSY',
  VALIDATE_LICENSE = 'VALIDATE_LICENSE',
  SET_USER = 'SET_USER',
  TOGGLE_SCANNER = 'TOGGLE_SCANNER',
  SET_PIN = 'SET_PIN',
  SET_CONFIRM_PIN = 'SET_CONFIRM_PIN',
  RESET_PINS = 'RESET_PINS',
  START_IN_APP_REGISTRATION = 'START_IN_APP_REGISTRATION',
  END_IN_APP_REGISTRATION = 'END_IN_APP_REGISTRATION',
  SET_LICENSE = 'SET_LICENSE',
  SET_TRACKER_STEP = 'SET_TRACKER_STEP',
}

type RegisterState = {
  isBusy: boolean;
  license: String;
  currentStep: Steps;
  user: User | null;
  isScanning: boolean;
  idUrl: String;
  pin: Array<string> | null;
  confirmPin: Array<string> | null;
  trackerSteps: {step: Steps; title: string}[];
  trackerStep: number;
};

type PayloadStep = {
  step: number;
  steps: {step: Steps; title: string}[];
};

export type Action =
  | {type: ActionKind; payload: string}
  | {type: ActionKind; payload: number}
  | {type: ActionKind; payload: boolean}
  | {type: ActionKind; payload: User}
  | {type: ActionKind; payload: Array<string>}
  | {type: ActionKind; payload: PayloadStep};

const registerReducer = (
  state: RegisterState,
  action: Action,
): RegisterState => {
  switch (action.type) {
    case ActionKind.SET_STEP: {
      return {
        ...state,
        currentStep: action.payload as number,
        isBusy: false,
      };
    }

    case ActionKind.SET_TRACKER_STEP: {
      return {
        ...state,
        trackerStep: (action.payload as PayloadStep).step,
        trackerSteps: (action.payload as PayloadStep).steps,
      };
    }

    case ActionKind.VALIDATE_LICENSE: {
      return {
        ...state,
        license: action.payload as string,
        isBusy: true,
        isScanning: false,
      };
    }

    case ActionKind.SET_BUSY: {
      return {
        ...state,
        isBusy: action.payload as boolean,
      };
    }

    case ActionKind.SET_PIN: {
      return {
        ...state,
        pin: action.payload as Array<string>,
      };
    }

    case ActionKind.SET_CONFIRM_PIN: {
      return {
        ...state,
        confirmPin: action.payload as Array<string>,
      };
    }

    case ActionKind.RESET_PINS: {
      return {
        ...state,
        confirmPin: null,
        pin: null,
      };
    }

    case ActionKind.TOGGLE_SCANNER: {
      return {
        ...state,
        isScanning: action.payload as boolean,
      };
    }

    case ActionKind.START_IN_APP_REGISTRATION: {
      return {
        ...state,
        currentStep: Steps.EnterPersonalInfo,
      };
    }

    case ActionKind.END_IN_APP_REGISTRATION: {
      return {
        ...state,
      };
    }

    case ActionKind.SET_LICENSE: {
      return {
        ...state,
        license: action.payload as string,
      };
    }

    case ActionKind.SET_USER: {
      return {
        ...state,
        user: {
          ...state.user,
          ...(action.payload as User),
        },
      };
    }
    default:
      return state;
  }
};

const initialState: RegisterState = {
  isBusy: false,
  license: '',
  currentStep: Steps.Start,
  user: null,
  isScanning: false,
  idUrl: '',
  pin: null,
  confirmPin: null,
  trackerSteps: [],
  trackerStep: 0,
};

const RegisterScreen: React.FC = () => {
  const {t} = useTranslation();
  const user = useAuthStore(state => state.user);

  const storeAuthenticatedUser = useAuthStore(
    state => state.storeAuthenticatedUser,
  );
  const toast = useToast();
  const [state, dispatch] = useReducer(registerReducer, initialState);
  const {data: insurers} = useFetchAllInsurers();
  const {data: doctors} = useFetchAllDoctors();

  const {
    mutate: submitLicense,
    status: licenseStatus,
    error: licenseError,
    data: licenseData,
  } = useValidateLicense();
  const {
    mutate: submitSMSCode,
    data: submitSMSData,
    status: submitSMSStatus,
    error: submitSMSError,
  } = useValidatePhoneNumber();
  const {
    mutate: uploadPhotoId,
    status: uploadIdStatus,
    data: uploadIdData,
    error: uploadIdError,
  } = useUploadPhotoOfId();
  const {
    mutate: registerUser,
    status: registerUserStatus,
    data: registerUserData,
    error: registerUserError,
  } = useRegisterUser();
  const {
    mutate: checkSedula,
    status: checkSedulaStatus,
    error: checkSedulaError,
  } = useCheckSedula();

  const registrationTrackerSteps = React.useMemo(
    () => [
      {step: Steps.Start, title: t('register.validateLicense')},
      {step: Steps.VerifyPhoneNumber, title: t('register.validatePhone')},
      {step: Steps.SetPin, title: t('register.setPin')},
      {step: Steps.SetPin, title: t('register.accountReady')},
    ],
    [t],
  );

  const inAppRegistrationTrackerSteps = React.useMemo(
    () => [
      {step: Steps.EnterPersonalInfo, title: t('register.personalInfo')},
      {step: Steps.EnterContactInfo, title: t('register.contactInfo')},
      {step: Steps.EnterInsuranceInfo, title: t('register.insuranceInfo')},
    ],
    [t],
  );

  useEffect(() => {
    dispatch({
      type: ActionKind.SET_USER,
      payload: user as User,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const stepIndex = registrationTrackerSteps.findIndex(
      x => x.step === state.currentStep,
    );
    const steps =
      stepIndex >= 0 ? registrationTrackerSteps : inAppRegistrationTrackerSteps;
    const currentStepIndex = steps.findIndex(x => x.step === state.currentStep);

    dispatch({
      type: ActionKind.SET_TRACKER_STEP,
      payload: {
        steps,
        step: currentStepIndex,
      },
    });
  }, [
    inAppRegistrationTrackerSteps,
    registrationTrackerSteps,
    state.currentStep,
  ]);

  /*
    License
  */
  useEffect(() => {
    if (licenseStatus === 'success') {
      dispatch({
        type: ActionKind.SET_USER,
        payload: licenseData!.check.apuuser,
      });

      setStep(Steps.VerifyPhoneNumber);
    }

    if (licenseStatus === 'error') {
      const responseStatus = licenseError?.response?.data?.check?.status;

      Alert.alert(
        'Oops!',
        responseStatus?.msg ?? 'Error validating your license',
      );
      setStep(Steps.Start);
    }
  }, [licenseData, licenseError, licenseStatus]);

  /*
    SMS
  */
  useEffect(() => {
    (async function () {
      if (submitSMSStatus === 'success') {
        const _user = {} as User;

        const authCreds = submitSMSData!.check.auth;
        const device = submitSMSData!.check.device;

        _user.biometricPassword = submitSMSData!.check.biometric;

        await AuthCreds.storeAuthCreds(authCreds);

        dispatch({
          type: ActionKind.SET_USER,
          payload: {..._user, device} as User,
        });

        /*
        If user hasn't uploaded a photo from his ID yet we push the user to that step.
        Otherwise we simply continue the registerig pr  ocess.
      */
        setStep(state.user?.needPhotoId === 1 ? Steps.uploadId : Steps.SetPin);
      }

      if (submitSMSStatus === 'error') {
        const responseStatus = submitSMSError?.response?.data?.check?.status;

        Alert.alert('Oops!', responseStatus?.msg);
        setStep(Steps.VerifyPhoneNumber);
      }
    })();
  }, [submitSMSData, submitSMSError, submitSMSStatus, state.user?.needPhotoId]);

  /*
    UploadId
  */
  useEffect(() => {
    if (uploadIdStatus === 'success') {
      setStep(Steps.SetPin);
    }

    if (uploadIdStatus === 'error') {
      const responseStatus = uploadIdError?.response?.data.uploadFotoId.status;

      Alert.alert('Oops!', responseStatus?.msg);
      setStep(Steps.uploadId);
    }
  }, [uploadIdData, uploadIdError, uploadIdStatus]);

  /*
    Check Sedula
  */
  useEffect(() => {
    if (checkSedulaStatus === 'success') {
      setStep(Steps.EnterContactInfo);
    }

    if (checkSedulaStatus === 'error') {
      const responseStatus = checkSedulaError?.response?.data.check.status;

      Alert.alert('error', responseStatus?.msg ?? 'Something went wrong');
      setStep(Steps.EnterPersonalInfo);
    }
  }, [checkSedulaError, checkSedulaStatus]);

  /*
    Register Account
  */
  useEffect(() => {
    if (registerUserStatus === 'success') {
      const {apuuser, licentie} = registerUserData!.access;

      dispatch({
        type: ActionKind.SET_USER,
        payload: apuuser,
      });
      dispatch({
        type: ActionKind.SET_LICENSE,
        payload: licentie,
      });

      setStep(Steps.VerifyPhoneNumber);
    }

    if (registerUserStatus === 'error') {
      const responseStatus = registerUserError?.response?.data?.access?.status;

      Alert.alert(
        'Oops!',
        responseStatus?.msg ??
          'Something went wrong creating your account. Please try again later.',
      );
      setStep(Steps.EnterInsuranceInfo);
    }
  }, [registerUserData, registerUserError, registerUserStatus]);

  /*
    Reached the finish of registration we simply store the user here.
    The user will be navigated to the dashboard afterwards.
  */
  const storeUser = useCallback(async () => {
    const userToStore: User = {
      ...state.user!,
      pin: state.pin?.join('') ?? '',
    };
    const isUserValidated = userToStore.isGevalideerd === 1;
    const toastType = isUserValidated ? ToastTypes.SUCCESS : ToastTypes.WARNING;
    const toastText = isUserValidated
      ? 'User successfully registed'
      : "User succesffuly registerd but hasn't been validated yet";

    console.log(userToStore, isUserValidated);
    await SecureStorage.setItem('user', JSON.stringify(userToStore));
    console.log('komt hier');
    // OneSignal.login(String(userToStore.apuId));

    storeAuthenticatedUser(userToStore);
    dispatch({
      type: ActionKind.SET_BUSY,
      payload: true,
    });
    // toast(toastText, toastType);
  }, [state.pin, state.user, storeAuthenticatedUser, toast]);

  useEffect(() => {
    if (state.pin == null || state.confirmPin == null) {
      return;
    }

    /*
      Here we can assume that the PIN has been entered twice succesfully
      So we finish the registration process by storing the user.
    */
    storeUser();
  }, [state.pin, state.confirmPin, storeUser]);

  const onPinError = () => {
    Alert.alert('Oops!', t('register.pinsDontMatch'));

    dispatch({
      type: ActionKind.RESET_PINS,
      payload: '',
    });
  };

  const validatePin = (pin: string[]) => {
    if (state.pin === null) {
      dispatch({
        type: ActionKind.SET_PIN,
        payload: pin,
      });

      return true;
    }

    if (!arrayEquals(state.pin, pin)) {
      return false;
    }

    dispatch({
      type: ActionKind.SET_CONFIRM_PIN,
      payload: pin,
    });

    return true;
  };

  const setStep = (step: Steps) =>
    dispatch({
      type: ActionKind.SET_STEP,
      payload: step,
    });

  const onQRScan = async (e: BarCodeReadEvent) => {
    const {data} = e;

    dispatch({
      type: ActionKind.VALIDATE_LICENSE,
      payload: data,
    });

    return submitLicense({
      license: data,
      lang: state.user?.language,
      device: await getDeviceInfo(),
    });
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case Steps.Start:
        return <StartStep dispatch={dispatch} />;
      // return <EnterPersonalInfoStep dispatch={dispatch} user={state.user!} />;

      case Steps.EnterLicenseManually:
        return (
          <EnterLicenseManuallyStep
            lang={state.user!.language}
            submit={submitLicense}
            dispatch={dispatch}
          />
        );
      case Steps.VerifyPhoneNumber:
        return (
          <VerifyPhoneNumberStep
            apuId={state.user!.apuId}
            dispatch={dispatch}
            license={state.license}
            submit={submitSMSCode}
          />
        );
      case Steps.uploadId:
        return (
          <UploadIdStep
            uploadPhotoId={uploadPhotoId}
            dispatch={dispatch}
            lang={state.user!.language}
            apuId={state.user!.apuId}
          />
        );
      case Steps.SetPin:
        return (
          <EnterPinStep
            onPinSuccess={() => {}}
            onPinError={onPinError}
            pinValidator={validatePin}
          />
        );
      case Steps.EnterPersonalInfo:
        return (
          <EnterPersonalInfoStep
            dispatch={dispatch}
            user={state.user!}
            checkSedula={checkSedula}
          />
        );
      case Steps.EnterContactInfo:
        return <EnterContactInfoStep user={state.user!} dispatch={dispatch} />;
      case Steps.EnterInsuranceInfo:
        return (
          <EnterInsuranceInfoStep
            insurers={insurers?.verzekeringen.lovs ?? []}
            doctors={doctors?.SQArtsen.lovs ?? []}
            user={state.user!}
            dispatch={dispatch}
            registerUser={registerUser}
          />
        );
      default:
        <StartStep dispatch={dispatch} />;
    }
  };

  return (
    <>
      <ScanQRCodeModal
        isVisisble={state.isScanning}
        onScan={onQRScan}
        onCancel={() =>
          dispatch({type: ActionKind.TOGGLE_SCANNER, payload: false})
        }
      />
      <PageContainer variant="blue">
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.flexGrow}>
          {/* <Header /> */}
          <Typography
            align="center"
            variant="h2"
            fontSize={30}
            text={t('register.register')}
            color="white"
          />
          <ProgressTracker
            containerStyle={styles.stepContainer}
            currentStep={state.trackerStep}
            steps={state.trackerSteps}
          />
          {state.isBusy ? (
            <Loader containerStyle={styles.loader} text={t('common.loading')} />
          ) : (
            <View style={styles.flex}>{renderStep()}</View>
          )}
        </KeyboardAwareScrollView>
      </PageContainer>
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  loader: {
    marginTop: -100,
  },
  stepContainer: {
    height: 35,
    marginTop: 50,
    marginBottom: 70,
  },
  qrScannerContainer: {
    ...(StyleSheet.absoluteFill as {}),
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
});

export default RegisterScreen;
