import React, {useState, useEffect, useMemo} from 'react';
import {StyleSheet, View, Alert, TouchableOpacity, Image} from 'react-native';

import {useQueryClient} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/core';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useFormik} from 'formik';
import {
  faUser,
  faIdBadge,
  faPhoneAlt,
  faAddressCard,
  faEnvelope,
  faVenusMars,
  faPlusCircle,
} from '@fortawesome/pro-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useActionSheet} from '@expo/react-native-action-sheet';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';

import useFetchAllInsurers from '@hooks/useFetchAllInsurers';
import useFetchAllDoctors from '@hooks/useFetchAllDoctors';
import useRegisterUser from '@hooks/useRegisterUser';
import useUploadPhotoOfId from '@hooks/useUploadPhotoOfId';

import useAuthStore from '@src/stores/useAuthStore';
import {
  Button,
  PageContainer,
  Typography,
  TextInput,
  SelectInput,
  Loader,
} from '@components/index';
import {Theme} from '@styles/index';
import {COUNTRIES, GENDERS} from '@src/constants';

const GENDERS_OPTIONS = GENDERS.map(x => {
  return {
    label: x.name,
    value: x.short,
  };
});

const PHOTO_OPTIONS: CameraOptions | ImageLibraryOptions = {
  mediaType: 'photo',
  includeBase64: true,
  maxHeight: 1000,
  maxWidth: 1000,
  quality: 0.2,
};

const RegisterMandansaScreen: React.FC = () => {
  const {primary, darkGray, darkRed} = Theme.colors;

  const {
    mutate: uploadPhotoId,
    status: uploadIdStatus,
    data: uploadIdData,
    error: uploadIdError,
  } = useUploadPhotoOfId();
  const {
    data: doctors,
    isLoading: isLoadingDoctors,
    isError: isErrorLoadingDoctors,
  } = useFetchAllDoctors();
  const {
    data: insurers,
    isLoading: isLoadingInsurers,
    isError: isErrorLoadingInsurers,
  } = useFetchAllInsurers();
  const {
    mutate: registerUser,
    status: registerUserStatus,
    data: registerUserData,
    error: registerUserError,
    isLoading: isCreatingAccount,
  } = useRegisterUser();

  const user = useAuthStore(state => state.user);

  const [selectedGender, setSelectedGender] = useState('M');
  const [selectedDoctorId, setSelectedDoctorId] = useState(0);
  const [selectedInsurerId, setSelectedInsurerId] = useState(0);
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<Asset>();
  const [mandansaApuId, setMandansaApuId] = useState(0);

  const queryClient = useQueryClient();
  const {goBack} = useNavigation();
  const {showActionSheetWithOptions} = useActionSheet();
  const {t} = useTranslation();
  const {handleChange, handleSubmit, values, errors} = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      idNumber: '',
      email: user?.email ?? '',
      phoneNumber:
        COUNTRIES.find(x => x.abbreviation === user?.lndKde)?.prefix || '5999',
      address: user?.adres ?? '',
    },
    onSubmit: submitForm,
    validationSchema: Yup.object({
      address: Yup.string(),
      email: Yup.string().email(t('registerMandansa.enterValidEmail')),
      phoneNumber: Yup.number()
        .required(t('registerMandansa.requiredField'))
        .typeError(t('registerMandansa.mustBeNumbers'))
        .test(
          'len',
          t('registerMandansa.validPhone'),
          val => val?.toString().length === 11,
        ),
      firstName: Yup.string()
        .required(t('registerMandansa.requiredField'))
        .min(2, t('registerMandansa.enterValidName'))
        .max(255),
      lastName: Yup.string()
        .required(t('registerMandansa.requiredField'))
        .min(2, t('registerMandansa.enterValidName'))
        .max(255)
        .matches(/^[A-Za-z ,-]*$/, t('registerMandansa.onlyLetters')),
      idNumber: Yup.number()
        .typeError(t('registerMandansa.mustBeNumbers'))
        .required(t('registerMandansa.requiredField'))
        .test(
          'len',
          t('registerMandansa.hasToBen10Chars'),
          val => val?.toString().length === 10,
        ),
    }),
  });

  function submitForm({
    firstName,
    lastName,
    idNumber,
    email,
    phoneNumber,
    address,
  }: {
    firstName: string;
    lastName: string;
    idNumber: string;
    email: string;
    phoneNumber: string;
    address: string;
  }) {
    registerUser({
      firstName,
      name: lastName,
      phoneNumber,
      idNumber,
      email: email ?? user?.email,
      address: address ?? user?.adres,
      country: user?.lndKde,
      language: user?.language,
      apuMdsId: user?.apuId,
      sex: selectedGender,
      doctorId: selectedDoctorId,
      insuranceId: selectedInsurerId,
    });
  }

  const doctorsOptions = useMemo(
    () =>
      doctors?.SQArtsen?.lovs
        .filter(x => x.lndKde === user?.lndKde)
        .map(x => {
          return {
            label: x.naam,
            value: x.id,
          };
        }),
    [doctors, user?.lndKde],
  );

  const insurersOptions = useMemo(
    () =>
      insurers?.verzekeringen?.lovs.map(x => {
        return {
          label: x.naam,
          value: x.id,
        };
      }),
    [insurers],
  );

  const handleOpenActionSheet = () => {
    const options = [
      t('register.selectFromGallery'),
      t('register.takePicture'),
      t('common.cancel'),
    ];

    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          handleSelectImageFromLibrary();
        }

        if (buttonIndex === 1) {
          handleTakeAPicture();
        }
      },
    );
  };

  const handleTakeAPicture = () => {
    launchCamera(PHOTO_OPTIONS, ({assets, didCancel}) => {
      if (!didCancel) {
        setImage(assets?.[0]);
      }
    });
  };

  const handleSelectImageFromLibrary = () => {
    launchImageLibrary(PHOTO_OPTIONS, ({assets, didCancel}) => {
      if (!didCancel) {
        setImage(assets?.[0]);
      }
    });
  };

  const handleSubmitPhotoId = () => {
    if (image === null || image === undefined) {
      Alert.alert('Oops!', t('registerMandansa.selectPhoto'));
    } else {
      return uploadPhotoId({
        apuId: user?.apuId,
        lang: user?.lang,
        image: image?.base64,
        refId: mandansaApuId,
      });
    }
  };

  useEffect(() => {
    if (doctorsOptions && insurersOptions) {
      setSelectedDoctorId(user?.sqArtId ?? doctorsOptions[0].value);
      setSelectedInsurerId(user?.vzkId ?? insurersOptions[0].value);
    }
  }, [doctorsOptions, insurersOptions, user?.sqArtId, user?.vzkId]);

  useEffect(() => {
    if (registerUserStatus === 'success') {
      setStep(2);
      setMandansaApuId(registerUserData?.access.apuuser.apuId!);
    }

    if (registerUserStatus === 'error') {
      const responseStatus = registerUserError?.response?.data?.access?.status;

      Alert.alert(
        'Oops!',
        responseStatus?.msg ?? t('registerMandansa.errorCreating'),
      );
    }
  }, [registerUserStatus, registerUserData, registerUserError, t]);

  /*
    UploadId
  */
  useEffect(() => {
    if (uploadIdStatus === 'success') {
      queryClient.invalidateQueries('mandansa');
      Alert.alert('Success', t('registerMandansa.successfullyCreated'));
      goBack();
    }

    if (uploadIdStatus === 'error') {
      const responseStatus = uploadIdError?.response?.data.uploadFotoId.status;
      Alert.alert('Oops!', responseStatus?.msg);
    }
  }, [uploadIdData, uploadIdError, uploadIdStatus, goBack, queryClient, t]);

  if (isLoadingDoctors || isLoadingInsurers) {
    return (
      <Loader
        text={t('common.loading')}
        indicatorColor={primary}
        textColor={primary}
      />
    );
  }

  if (isErrorLoadingDoctors || isErrorLoadingInsurers) {
    return <Typography variant="h1" align="center" text="Error" />;
  }

  return (
    <PageContainer style={styles.container} variant="gray">
      <View style={styles.topSectionContainer}>
        <Typography
          align="center"
          color={primary}
          variant="h2"
          text={t('registerMandansa.title')}
        />
        <Typography
          align="center"
          variant="b1"
          text={t('registerMandansa.introText')}
        />
      </View>
      <View style={styles.midSectionContainer}>
        <View style={styles.box}>
          <>
            {!isCreatingAccount ? (
              <KeyboardAwareScrollView
                extraHeight={20}
                contentContainerStyle={styles.flex}>
                <View style={styles.header}>
                  <Typography
                    variant="h6"
                    align="right"
                    color={primary}
                    fontWeight="bold"
                    textStyle={styles.italic}
                    text={
                      step === 1
                        ? t('registerMandansa.fillInMandansa')
                        : t('registerMandansa.uploadMandansaId')
                    }
                  />
                  <Typography
                    variant="h6"
                    align="right"
                    color={primary}
                    fontWeight="bold"
                    textStyle={styles.italic}
                    text={`${t('registerMandansa.step')}: ${step}/2`}
                  />
                </View>
                {step === 1 ? (
                  <>
                    <TextInput
                      label={t('registerMandansa.firstName')}
                      errorColor={darkRed}
                      mainColor={darkGray}
                      iconStyle={{color: darkGray}}
                      onChangeText={handleChange('firstName')}
                      error={errors.firstName}
                      icon={faUser}
                      value={values.firstName}
                      textColor="black"
                      autoCapitalize="none"
                    />
                    <TextInput
                      label={t('registerMandansa.lastName')}
                      errorColor={darkRed}
                      mainColor={darkGray}
                      iconStyle={{color: darkGray}}
                      onChangeText={handleChange('lastName')}
                      error={errors.lastName}
                      icon={faUser}
                      value={values.lastName}
                      textColor="black"
                      autoCapitalize="none"
                    />
                    <SelectInput
                      label={t('registerMandansa.gender')}
                      onValueChange={value => setSelectedGender(value)}
                      icon={faVenusMars}
                      items={GENDERS_OPTIONS}
                      bottomBorderStyle={styles.bottomBorderStyle}
                      iconStyle={styles.darkGray}
                      labelStyle={styles.selectLabelStyle}
                      value={selectedGender}
                    />
                    <TextInput
                      label={t('registerMandansa.address')}
                      errorColor={darkRed}
                      mainColor={darkGray}
                      iconStyle={{color: darkGray}}
                      onChangeText={handleChange('address')}
                      error={errors.address}
                      icon={faAddressCard}
                      value={values.address}
                      textColor="black"
                      autoCapitalize="none"
                    />
                    <TextInput
                      label={t('registerMandansa.phoneNumber')}
                      errorColor={darkRed}
                      mainColor={darkGray}
                      iconStyle={{color: darkGray}}
                      onChangeText={handleChange('phoneNumber')}
                      error={errors.phoneNumber}
                      icon={faPhoneAlt}
                      value={values.phoneNumber}
                      textColor="black"
                      autoCapitalize="none"
                      keyboardType="number-pad"
                    />
                    <TextInput
                      label={t('registerMandansa.email')}
                      errorColor={darkRed}
                      mainColor={darkGray}
                      iconStyle={{color: darkGray}}
                      onChangeText={handleChange('email')}
                      error={errors.email}
                      icon={faEnvelope}
                      value={values.email}
                      textColor="black"
                      autoCapitalize="none"
                    />
                    <TextInput
                      label={t('registerMandansa.idNumber')}
                      errorColor={darkRed}
                      mainColor={darkGray}
                      iconStyle={{color: darkGray}}
                      onChangeText={handleChange('idNumber')}
                      error={errors.idNumber}
                      icon={faIdBadge}
                      value={values.idNumber}
                      textColor="black"
                      autoCapitalize="none"
                      keyboardType="number-pad"
                    />
                    <SelectInput
                      label={t('registerMandansa.doctor')}
                      onValueChange={value => setSelectedDoctorId(value)}
                      icon={faVenusMars}
                      items={doctorsOptions!}
                      bottomBorderStyle={styles.bottomBorderStyle}
                      iconStyle={styles.darkGray}
                      labelStyle={styles.selectLabelStyle}
                      value={selectedDoctorId}
                    />
                    <SelectInput
                      label={t('registerMandansa.insurer')}
                      onValueChange={value => setSelectedInsurerId(value)}
                      icon={faVenusMars}
                      items={insurersOptions!}
                      bottomBorderStyle={styles.bottomBorderStyle}
                      iconStyle={styles.darkGray}
                      labelStyle={styles.selectLabelStyle}
                      value={selectedInsurerId}
                    />
                  </>
                ) : (
                  <View style={styles.uploadIdContainer}>
                    {uploadIdStatus !== 'loading' ? (
                      <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={handleOpenActionSheet}>
                        {image === undefined ? (
                          <FontAwesomeIcon
                            icon={faPlusCircle}
                            color={primary}
                            size={40}
                          />
                        ) : (
                          <Image
                            style={styles.image}
                            resizeMode="cover"
                            source={{uri: image?.uri!}}
                          />
                        )}
                      </TouchableOpacity>
                    ) : (
                      <Loader
                        indicatorColor={primary}
                        textColor={primary}
                        text={t('registerMandansa.uploadingId')}
                      />
                    )}
                  </View>
                )}
              </KeyboardAwareScrollView>
            ) : (
              <Loader
                text={t('common.loading')}
                indicatorColor={primary}
                textColor={primary}
              />
            )}
          </>
        </View>
      </View>
      <View style={styles.bottomSectionContainer}>
        <Button
          buttonStyle={styles.button}
          onPress={step === 1 ? handleSubmit : handleSubmitPhotoId}
          text={
            step === 1 ? t('common.continue') : t('registerMandansa.register')
          }
        />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Theme.spacing.verticalPadding / 2,
  },
  topSectionContainer: {
    flex: 0.15,
  },
  midSectionContainer: {
    flex: 0.75,
    backgroundColor: 'yellow',
  },
  bottomSectionContainer: {
    flex: 0.1,
    justifyContent: 'center',
  },
  uploadIdContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex: {
    flexGrow: 1,
  },
  box: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Theme.colors.lightGray,
    paddingHorizontal: 22,
    paddingVertical: 20,
    borderRadius: 5,
    height: 600,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 9.5,
    elevation: 13,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    alignSelf: 'center',
  },
  italic: {
    fontStyle: 'italic',
  },
  selectLabelStyle: {
    color: Theme.colors.darkGray,
    fontWeight: 'normal',
  },
  darkGray: {
    color: Theme.colors.darkGray,
  },
  bottomBorderStyle: {
    borderBottomColor: Theme.colors.darkGray,
  },
  uploadButton: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default RegisterMandansaScreen;
