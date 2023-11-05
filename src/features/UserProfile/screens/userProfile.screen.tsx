import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Switch,
  KeyboardAvoidingView,
} from 'react-native';

import {
  faUser,
  faIdCard,
  faShieldAlt,
  faEnvelope,
  faVenusMars,
  faMapMarkerAlt,
  faPhoneAlt,
  faUserNurse,
  faFlag,
  faSave,
} from '@fortawesome/pro-regular-svg-icons';
import * as Yup from 'yup';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCheck, faPencilAlt} from '@fortawesome/pro-solid-svg-icons';
import {Item} from 'react-native-picker-select';
import {useFormik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {useNavigation} from '@react-navigation/core';
import {useTranslation} from 'react-i18next';
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {INSURERS, LANGUAGES, Insurers} from '@src/constants';
import {ValidationStatus} from '@src/types/validationStatus';
import {
  PageContainer,
  TextInput,
  SelectInput,
  Button,
  Typography,
  Loader,
} from '@components/index';
import {Theme} from '@styles/styles';
import useAuthStore from '@stores/useAuthStore';
import SecureStorage from '@helpers/secureStorage';
import usePermissions, {Permissions} from '@hooks/usePermissions';
import usePin from '@hooks/usePin';
import useTheme from '@hooks/useTheme';
import useFetchAllDoctors, {LovDoctor} from '@hooks/useFetchAllDoctors';
import useInternetConnection from '@hooks/useInternetConnection';

import useSaveUserProfile from '../hooks/useSaveUserProfile';
import useUploadProiflePicture from '../hooks/useUploadProfilePicture';
import useAdditionalAInsuranceStatus from '../hooks/useAdditionalInsuranceStatus';

const UserProfileScreen: React.FC = () => {
  const appTheme = useTheme();

  const [user, setUser] = useAuthStore(state => [state.user, state.setUser]);

  const {t, i18n} = useTranslation();
  const {navigate} = useNavigation();
  const {mutateAsync, isLoading: IsSavingProfile} = useSaveUserProfile();
  const {mutateAsync: uploadProfilePic, isLoading} = useUploadProiflePicture();
  const {data: doctorsLOV} = useFetchAllDoctors();
  const {showActionSheetWithOptions} = useActionSheet();
  const {checkIfConnected} = useInternetConnection();

  const [hasBiometricsPermissions] = usePermissions(Permissions.faceId);

  const [isBiometricEnabled, setIsBiometricEnabled] = useState(
    user?.biometricEnabled,
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [languages, setLanguages] = useState<Array<Item>>([]);
  const [insurers, setInsurers] = useState<Array<Item>>([]);
  const [doctors, setDoctors] = useState<Array<Item>>([]);
  const [selectedLanguage, setSelectedLang] = useState<string>('');
  const [selectedDoctors, setSelectedDoctors] = useState<number>(0);
  const [selectedInsurers, setSelectedInsurers] = useState<number>(0);
  const [profilePicURL, setProfilePicURL] = useState<string>(user?.foto ?? '');
  const [checkmarkColor, _] = useState<string>(
    useAdditionalAInsuranceStatus(user?.vzk2Status ?? -1).checkmarkColor,
  );
  const {changeUserPin} = usePin(user?.pin ?? '');

  const styles = makeStyles(appTheme, isEditing);

  const isUserValidated = user?.validationStatus === ValidationStatus.VALIDATED;

  const photoOptions: CameraOptions | ImageLibraryOptions = {
    mediaType: 'photo',
    includeBase64: true,
    maxHeight: 1000,
    maxWidth: 1000,
    quality: 0.2,
  };

  useEffect(() => {
    setSelectedLang(user?.lang ?? '');
    if (user?.vzkId !== 301 || user.vzk2Id === null) {
      setSelectedInsurers(-1);
    } else {
      setSelectedInsurers(user.vzk2Id);
    }

    if (doctorsLOV) {
      setSelectedDoctors(user?.sqArtId!);
    }
  }, [user, doctorsLOV]);

  useEffect(() => {
    var languagesArr = LANGUAGES.map((language: Language) => {
      return {label: language.name, value: language.abbreviation};
    }, []);
    var insurersArr = INSURERS.filter(x => x.id !== 301).map(
      (insurer: Insurer) => {
        return {label: insurer.name, value: insurer.id};
      },
      [],
    );

    setLanguages(languagesArr);
    setInsurers(insurersArr);
  }, []);

  useEffect(() => {
    var doctorsArr =
      doctorsLOV &&
      doctorsLOV.SQArtsen.lovs.map((doctor: LovDoctor) => {
        return {label: doctor.naam, value: doctor.id};
      });
    setDoctors(doctorsArr ?? []);
  }, [doctorsLOV]);

  const {handleChange, handleSubmit, values, errors} = useFormik({
    initialValues: {
      firstName: user!.firstName,
      email: user!.email,
      phoneNumber: user!.sms,
      address: user!.adres,
      name: user!.naam,
    },
    onSubmit: submitForm,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .required(t('profile.fillInEverything'))
        .min(2, 'Je naam moet meer dan 2 letters bevatten')
        .max(255)
        .matches(/^[A-Za-z ,-]*$/, t('profile.incorrectNameFormat')),
      name: Yup.string()
        .required(t('profile.fillInEverything'))
        .min(2, 'Je naam moet meer dan 2 letters bevatten')
        .max(255)
        .matches(/^[A-Za-z ,-]*$/, t('profile.incorrectNameFormat')),
      email: Yup.string()
        .email(t('profile.incorrectEmail'))
        .required("Can't be empty")
        .max(255),
      phoneNumber: Yup.string()
        .required(t('profile.fillInEverything'))
        .matches(
          /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
          t('profile.incorrectPhoneFormat'),
        )
        .max(11, 'telefoon nummber bestaat minimaal uit 10 nummers')
        .min(10, 'telefoon nummer bestaat maximaal uit 11 nummers'),
      address: Yup.string().required(t('profile.fillInEverything')).max(255),
    }),
  });

  async function submitForm({
    firstName,
    name,
    email,
    phoneNumber,
    address,
  }: {
    firstName: string;
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
  }) {
    try {
      setIsEditing(false);
      var newUser: User = {
        ...user!,
        email,
        firstName,
        adres: address,
        sms: phoneNumber,
        naam: name,
        lang: selectedLanguage,
        sqArtId: selectedDoctors,
        vzk2Id: selectedInsurers,
        biometricEnabled: isBiometricEnabled!,
      };

      if (JSON.stringify(user) !== JSON.stringify(newUser)) {
        const response = await mutateAsync(newUser);
        const isSuccess = response.app.status.status >= 0;

        if (isSuccess) {
          let userResponse = {...response.app, ...newUser};
          setUser(userResponse);
          i18n.changeLanguage(selectedLanguage);
          await SecureStorage.setItem('user', JSON.stringify(userResponse));
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  const inputColor = '#c7c5c5';
  let editableInputColor = isEditing ? 'black' : inputColor;

  const editButtonPressed = () => {
    checkIfConnected(async () => {
      if (isEditing) {
        handleSubmit();
      } else {
        setIsEditing(true);
      }
    });
  };

  const showChangeProfilePicOptions = () => {
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options: ['Take picture', 'Choose from gallery', 'cancel'],
        cancelButtonIndex,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          handleTakeAPicture();
        }

        if (buttonIndex === 1) {
          handleSelectImageFromLibrary();
        }
      },
    );
  };

  const handleTakeAPicture = () => {
    try {
      launchCamera(photoOptions, async ({assets, didCancel}) => {
        if (!didCancel && !!assets) {
          const response = await uploadProfilePic({
            apuId: user?.apuId,
            image: assets[0].base64,
          });

          setProfilePicURL(response.uploadFotoId.fotoUrl);
        }
      });
    } catch (e) {
      Alert.alert(
        'Oops',
        'Something went wrong opening your camera. Please check your permissions',
      );
    }
  };

  const handleSelectImageFromLibrary = () => {
    try {
      launchImageLibrary(photoOptions, async ({assets, didCancel}) => {
        if (!didCancel && !!assets) {
          const response = await uploadProfilePic({
            apuId: user?.apuId,
            image: assets[0].base64,
          });

          setProfilePicURL(response.uploadFotoId.fotoUrl);
        }
      });
    } catch (e) {
      Alert.alert(
        'Oops',
        'Something went wrong opening your gallery. Please check your permissions',
      );
    }
  };

  const handleBiometricChange = async (enableBiometrics: boolean) => {
    let enable = enableBiometrics && hasBiometricsPermissions;

    if (enableBiometrics && !hasBiometricsPermissions) {
      Alert.alert('Whoops', t('profile.biometricNotAvailable'));
    }

    setIsBiometricEnabled(enable);
  };

  const changePin = async () => {
    try {
      await changeUserPin('Profile');
    } catch (e) {}
  };

  return (
    <>
      <PageContainer
        style={styles.flex}
        variant={
          user?.vzkId === Insurers.Fatum
            ? 'purple'
            : user?.vzkId === Insurers.SVB
            ? 'blue'
            : 'green'
        }>
        <KeyboardAvoidingView
          style={styles.flex}
          keyboardVerticalOffset={30}
          behavior="height">
          <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.flex}>
              <TouchableOpacity
                disabled={!isEditing}
                onPress={showChangeProfilePicOptions}
                style={styles.profilePictureContainer}>
                <View style={styles.profilePicture}>
                  {isLoading ? (
                    <View style={styles.profilePicLoaderContainer}>
                      <ActivityIndicator color={appTheme.colors.primary} />
                    </View>
                  ) : (
                    <Image
                      source={{
                        uri: profilePicURL,
                        headers: {
                          Pragma: 'no-cache',
                          'Cache-Control': 'no-cache, no-store',
                          Expires: '0',
                        },
                      }}
                      style={styles.profilePictureImage}
                    />
                  )}
                </View>
              </TouchableOpacity>
              <View style={styles.box}>
                {!IsSavingProfile ? (
                  <>
                    <TextInput
                      label={t('profile.firstName')}
                      onChangeText={handleChange('firstName')}
                      value={values.firstName}
                      errorColor="red"
                      error={errors.firstName}
                      icon={faUser}
                      editable={isEditing}
                      iconStyle={{color: editableInputColor}}
                      mainColor={editableInputColor}
                      textColor="black"
                      labelTextStyle={styles.inputLabelText}
                      autoCapitalize="none"
                    />
                    <TextInput
                      label={t('profile.name')}
                      onChangeText={handleChange('name')}
                      value={values.name}
                      errorColor="red"
                      error={errors.name}
                      icon={faUser}
                      editable={isEditing}
                      iconStyle={{color: editableInputColor}}
                      mainColor={editableInputColor}
                      textColor="black"
                      labelTextStyle={styles.inputLabelText}
                      autoCapitalize="none"
                    />
                    <TextInput
                      label={t('profile.idNumber')}
                      value={user!.idNummer}
                      editable={false}
                      icon={faIdCard}
                      iconStyle={{color: inputColor}}
                      mainColor={inputColor}
                      textColor="black"
                      labelTextStyle={styles.inputLabelText}
                      autoCapitalize="none"
                    />
                    <TextInput
                      label={t('profile.insurer')}
                      value={user?.vzkNaam}
                      icon={faShieldAlt}
                      editable={false}
                      iconStyle={{color: inputColor}}
                      mainColor={inputColor}
                      textColor="black"
                      labelTextStyle={styles.inputLabelText}
                      autoCapitalize="none"
                    />
                    <TextInput
                      label={t('profile.email')}
                      onChangeText={handleChange('email')}
                      value={values.email}
                      errorColor="red"
                      error={errors.email}
                      editable={isEditing}
                      icon={faEnvelope}
                      iconStyle={{color: editableInputColor}}
                      mainColor={editableInputColor}
                      textColor="black"
                      labelTextStyle={styles.inputLabelText}
                      autoCapitalize="none"
                    />
                    <TextInput
                      label={t('profile.gender')}
                      value={user!.sex}
                      icon={faVenusMars}
                      iconStyle={{color: inputColor}}
                      mainColor={inputColor}
                      editable={false}
                      textColor="black"
                      labelTextStyle={styles.inputLabelText}
                      autoCapitalize="none"
                    />
                    <TextInput
                      label={t('profile.adres')}
                      onChangeText={handleChange('address')}
                      value={values.address}
                      errorColor="red"
                      error={errors.address}
                      icon={faMapMarkerAlt}
                      editable={isEditing}
                      iconStyle={{color: editableInputColor}}
                      mainColor={editableInputColor}
                      textColor="black"
                      labelTextStyle={styles.inputLabelText}
                      autoCapitalize="none"
                    />
                    <View style={styles.additionalInsuranceInputContainer}>
                      <SelectInput
                        containerStyle={styles.additionalInsuranceInput}
                        label={t('profile.additionalInsurance')}
                        value={selectedInsurers}
                        onValueChange={value => setSelectedInsurers(value)}
                        disabled={user?.vzkId !== Insurers.SVB || !isEditing}
                        bottomBorderStyle={{
                          borderBottomColor: !(
                            user!.vzkId !== Insurers.SVB || !isEditing
                          )
                            ? editableInputColor
                            : inputColor,
                        }}
                        icon={faUserNurse}
                        items={insurers}
                      />
                      {user?.vzk2Id !== -1 && (
                        <FontAwesomeIcon
                          size={25}
                          style={styles.additionalInsuranceCheckmark}
                          color={checkmarkColor}
                          icon={faCheck}
                        />
                      )}
                    </View>
                    <SelectInput
                      label={t('profile.familyDoctor')}
                      value={selectedDoctors}
                      disabled={!isEditing}
                      onValueChange={value => setSelectedDoctors(value)}
                      icon={faUserNurse}
                      bottomBorderStyle={{
                        borderBottomColor: editableInputColor,
                      }}
                      items={doctors}
                    />

                    <TextInput
                      icon={faPhoneAlt}
                      label={t('profile.phoneNumber')}
                      onChangeText={handleChange('phoneNumber')}
                      value={values.phoneNumber}
                      errorColor="red"
                      error={errors.phoneNumber}
                      keyboardType="number-pad"
                      editable={isEditing}
                      iconStyle={{color: editableInputColor}}
                      mainColor={editableInputColor}
                      textColor="black"
                      labelTextStyle={styles.inputLabelText}
                      autoCapitalize="none"
                    />

                    <SelectInput
                      label={t('profile.language')}
                      disabled={!isEditing}
                      value={selectedLanguage}
                      onValueChange={value => setSelectedLang(value)}
                      icon={faFlag}
                      bottomBorderStyle={{
                        borderBottomColor: editableInputColor,
                      }}
                      items={languages}
                    />

                    <View style={styles.biometricSettingContainer}>
                      <Typography
                        variant="b1"
                        color={appTheme.colors.darkGray}
                        textStyle={styles.biometricText}
                        text={t('profile.biometric')}
                      />
                      <Switch
                        disabled={!isEditing}
                        value={isBiometricEnabled && hasBiometricsPermissions}
                        onValueChange={handleBiometricChange}
                      />
                    </View>

                    <Button
                      variant="outline"
                      textStyle={{
                        color: isEditing
                          ? appTheme.colors.primary
                          : editableInputColor,
                      }}
                      buttonStyle={styles.changePasswordButton}
                      disabled={!isEditing}
                      onPress={() => navigate('ChangePassword')}
                      text="Change Password"
                    />
                    <Button
                      variant="outline"
                      textStyle={{
                        color: isEditing
                          ? appTheme.colors.primary
                          : editableInputColor,
                      }}
                      buttonStyle={styles.changePasswordButton}
                      disabled={!isEditing}
                      onPress={() => changePin()}
                      text="Change Pin"
                    />
                  </>
                ) : (
                  <View style={styles.flex}>
                    <Loader
                      textColor="black"
                      indicatorColor="black"
                      text={t('profile.savingProfile')}
                    />
                  </View>
                )}
              </View>
            </View>
          </KeyboardAwareScrollView>
          <TouchableOpacity
            disabled={!isUserValidated}
            onPress={editButtonPressed}
            style={[
              styles.editButton,
              !isUserValidated && styles.editButtonDisabled,
            ]}>
            <FontAwesomeIcon
              color="white"
              size={20}
              icon={isEditing ? faSave : faPencilAlt}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </PageContainer>
    </>
  );
};

const makeStyles = (theme: Theme, isEditing: boolean) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    profilePicture: {
      height: 140,
      width: 140,
      borderRadius: 70,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 5,
      backgroundColor: 'white',
    },
    profilePicLoaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profilePictureImage: {
      flex: 1,
      borderRadius: 70,
    },
    scrollViewContent: {
      flexGrow: 1,
      paddingVertical: 20,
    },
    profilePictureContainer: {
      zIndex: 2,
      elevation: 15,
      alignItems: 'center',
    },
    box: {
      flex: 1,
      marginTop: -25,
      paddingHorizontal: 22,
      paddingVertical: 0,
      borderRadius: 5,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.39,
      shadowRadius: 9.5,
      elevation: 13,
      paddingBottom: 20,
    },
    inputLabelText: {
      fontWeight: 'bold',
    },
    changePasswordButton: {
      marginTop: 10,
      borderColor: isEditing ? theme.colors.primary : '#c7c5c5',
    },
    biometricSettingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
    },
    biometricText: {
      marginRight: 15,
    },
    editButton: {
      position: 'absolute',
      width: 60,
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 20,
      right: 10,
      height: 60,
      borderRadius: 30,
      elevation: 1,
      backgroundColor: theme.colors.primary,
    },
    editButtonDisabled: {
      backgroundColor: 'gray',
    },
    additionalInsuranceInputContainer: {
      flexDirection: 'row',
      marginVertical: 8,
    },
    additionalInsuranceInput: {
      marginVertical: 0,
      flex: 1,
    },
    additionalInsuranceCheckmark: {
      alignSelf: 'center',
      marginTop: 13,
      marginLeft: 11,
    },
  });

export default UserProfileScreen;
