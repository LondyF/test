import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {
  Asset,
  CameraOptions,
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';

import * as Yup from 'yup';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Button, Typography, TextInput, SelectInput} from '@src/components';
import {Theme} from '@styles/styles';
import useTheme from '@hooks/useTheme';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useFormik} from 'formik';
import {
  faCalendar,
  faCamera,
  faChevronLeft,
  faHome,
  faReceipt,
  faUser,
} from '@fortawesome/pro-solid-svg-icons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';

import useAuthStore from '@src/stores/useAuthStore';
import useToast from '@src/components/Toast/useToast';
import {ToastTypes} from '@src/components/Toast/toastTypes';
import useFetchDepartments from '../hooks/useFetchDepartments';
import useCreateDeclarationSession from '../hooks/useCreateDeclarationSession';
import useFetchProviders from '../hooks/useFetchProviders';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-date-picker';
import useFetchCountries from '@src/hooks/useFetchCountries';

type Props = {
  navigation: NavigationProp<{}>;
};

const LINEAR_BACKGROUND_COLORS = ['#50329F', '#8F76CF', '#AE98E7', '#50329F'];
const LINEAR_BACKGROUND_LOCATIONS = [0, 0.17, 0.31, 0.99];

const NewDeclarationScreen = ({}: Props) => {
  const theme = useTheme();
  const user = useAuthStore(state => state.user);
  const [isDateModalopen, setIsDateModalOpen] = useState(false);
  const {navigate, goBack} = useNavigation();
  const styles = makeStyles(theme);
  const toast = useToast();

  const inputStyles = {
    inputAndroidStyle: {...styles.inputStyle},
    inputIOSStyle: {...styles.inputStyle},
    style: {placeholder: {...styles.inputStyle}},
  };

  const {mutate, isPending} = useCreateDeclarationSession();

  const {handleChange, handleSubmit, values, setFieldValue, errors} = useFormik(
    {
      validateOnChange: false,
      validationSchema: Yup.object().shape({
        totalAmount: Yup.number()
          .required('Total amount is required')
          .positive('Total amount must be a positive number'),
        selectedDepartmentId: Yup.number()
          .required('Department is required')
          .positive('Department must be a positive number'),
        selectedProviderId: Yup.number()
          .required('Provider is required')
          .positive('Provider must be a positive number'),
        date: Yup.string().required('Date is required'),
        country: Yup.string().required('Country is required'),
        image: Yup.object<Asset>().required('Image is required'),
      }),
      initialValues: {
        totalAmount: '',
        selectedDepartmentId: 0,
        selectedProviderId: 0,
        currency: 'Xcg',
        country: 'CUR',
        date: moment().format('DD MMM YYYY'),
        image: {} as Asset,
      },
      onSubmit: async submittedValues => {
        mutate(
          {
            bedrag: Number(submittedValues.totalAmount),
            lndKde: submittedValues.country,
            currency: submittedValues.currency,
            apuId: user?.apuId!,
            vkcId: submittedValues.selectedDepartmentId,
            sqArtId: submittedValues.selectedProviderId,
            datum: moment(submittedValues.date, 'DD MMM YYYY').toISOString(),
            imageBase64: submittedValues.image?.base64 || '',
          },
          {
            onSuccess: data => {
              toast('Declaration created successfully', ToastTypes.SUCCESS);

              //@ts-ignore
              navigate('Declaration', {
                sesId: data[0].sesId,
              });
            },
          },
        );
      },
    },
  );

  const {data: departmentsData} = useFetchDepartments(user?.apuId!);
  const {data: providersData} = useFetchProviders(values.selectedDepartmentId);
  const {data: countriesData} = useFetchCountries({apuId: user?.apuId!});

  const departmentsOptions =
    departmentsData?.map(department => ({
      label: department.naam,
      value: department.id,
    })) || [];

  const providersOptions =
    providersData?.map(provider => ({
      label: provider.naam,
      value: provider.id,
    })) || [];

  const countryOptions =
    countriesData?.map(country => ({
      label: country.naam,
      value: country.iso,
    })) || [];

  const currencyOptions =
    countriesData?.map(country => ({
      label: country.valuta,
      value: country.valuta,
    })) || [];

  const handlePhotoPress = () => {
    const photoOptions: CameraOptions | ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 1000,
      maxWidth: 1000,
    };

    launchImageLibrary(photoOptions, ({didCancel, assets}) => {
      if (didCancel) {
        return;
      }

      setFieldValue('image', assets?.[0] || null);
    });
  };

  const closeDateModal = () => {
    setIsDateModalOpen(false);
  };

  const openDateModal = () => {
    setIsDateModalOpen(true);
  };

  const setDateValue = (date: Date) => {
    setFieldValue('date', moment(date).format('DD MMM YYYY'));
    closeDateModal();
  };

  const convertStringToDate = (dateString: string) => {
    return moment(dateString, 'DD MMM YYYY').toDate();
  };

  return (
    <LinearGradient
      colors={LINEAR_BACKGROUND_COLORS}
      locations={LINEAR_BACKGROUND_LOCATIONS}
      style={styles.linearGradient}>
      <SafeAreaView style={{flex: 1}}>
        <DatePicker
          modal
          open={isDateModalopen}
          date={convertStringToDate(values.date)}
          mode="date"
          onConfirm={setDateValue}
          onCancel={closeDateModal}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.flex}>
              <KeyboardAwareScrollView
                style={styles.container}
                keyboardShouldPersistTaps="handled">
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Button
                    variant="transparent"
                    text=""
                    style={{minWidth: 0, padding: 10, paddingLeft: 0}}
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                    customTextComponent={
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        size={20}
                        color="white"
                      />
                    }
                    onPress={() => {
                      goBack();
                    }}
                  />
                  <Typography
                    color="white"
                    variant="h2"
                    text="New Declaration"
                  />
                </View>
                <View style={styles.imageUploadWrapper}>
                  <TouchableOpacity
                    style={styles.imageUploadContainer}
                    onPress={handlePhotoPress}>
                    {Object.keys(values.image).length !== 0 ? (
                      <Image
                        source={{uri: values.image?.uri}}
                        style={styles.image}
                      />
                    ) : (
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}>
                        <View style={styles.imageIconContainer}>
                          <FontAwesomeIcon
                            icon={faCamera}
                            color={theme.colors.primary}
                            size={30}
                          />
                        </View>
                        <Typography
                          color="white"
                          align="center"
                          text="Add Photo"
                          fontWeight="bold"
                          variant="h5"
                          textStyle={{marginTop: 10}}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                  {errors.image && (
                    <Typography
                      variant="b1"
                      textStyle={styles.errorText}
                      text={errors.image as string}
                    />
                  )}
                </View>
                <View style={styles.hr} />
                <Typography variant="h2" color="white" text="Info" />
                <TextInput
                  label="Total Amount"
                  mainColor="white"
                  value={values.totalAmount}
                  onChangeText={handleChange('totalAmount')}
                  icon={faReceipt}
                  autoCapitalize="none"
                  keyboardType="numeric"
                  error={errors.totalAmount}
                />
                <SelectInput
                  label={'Department'}
                  onValueChange={value => {
                    if (value) {
                      setFieldValue('selectedDepartmentId', Number(value));
                    }
                  }}
                  items={departmentsOptions}
                  value={values.selectedDepartmentId}
                  iconStyle={styles.colorBlack}
                  bottomBorderStyle={styles.bottomBlack}
                  labelStyle={styles.colorBlack}
                  itemKey={values.selectedDepartmentId}
                  error={errors.selectedDepartmentId}
                  icon={faHome}
                  {...inputStyles}
                />
                <SelectInput
                  label={'Provider'}
                  onValueChange={value => {
                    if (value) {
                      setFieldValue('selectedProviderId', Number(value));
                    }
                  }}
                  items={providersOptions}
                  value={values.selectedProviderId}
                  itemKey={values.selectedProviderId}
                  iconStyle={styles.colorBlack}
                  bottomBorderStyle={styles.bottomBlack}
                  labelStyle={styles.colorBlack}
                  icon={faUser}
                  error={errors.selectedProviderId}
                  {...inputStyles}
                />
                <TouchableOpacity onPress={openDateModal}>
                  <TextInput
                    label="Date"
                    disabled
                    mainColor="white"
                    value={values.date}
                    icon={faCalendar}
                    autoCapitalize="none"
                  />
                </TouchableOpacity>
                <SelectInput
                  label={'Country'}
                  onValueChange={value => {
                    if (value) {
                      setFieldValue('country', value);
                      setFieldValue(
                        'currency',
                        countriesData?.find(country => country.iso === value)
                          ?.valuta,
                      );
                    }
                  }}
                  items={countryOptions}
                  value={values.country}
                  itemKey={values.selectedProviderId}
                  iconStyle={styles.colorBlack}
                  bottomBorderStyle={styles.bottomBlack}
                  labelStyle={styles.colorBlack}
                  icon={faUser}
                  error={errors.country}
                  {...inputStyles}
                />
                <SelectInput
                  label={'Currency'}
                  onValueChange={value => {
                    if (value) {
                      setFieldValue('currency', value);
                    }
                  }}
                  items={currencyOptions}
                  value={values.currency}
                  itemKey={values.selectedProviderId}
                  iconStyle={styles.colorBlack}
                  bottomBorderStyle={styles.bottomBlack}
                  labelStyle={styles.colorBlack}
                  icon={faUser}
                  error={errors.country}
                  disabled
                  {...inputStyles}
                />
              </KeyboardAwareScrollView>
              <View style={styles.bottomContainer}>
                <Button
                  loading={isPending}
                  variant="primary"
                  text="Submit"
                  onPress={() => handleSubmit()}
                  buttonStyle={styles.buttonStyle}
                  textStyle={styles.buttonTextStyle}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    inputStyle: {
      color: 'white',
    },
    container: {
      flex: 1,
    },
    imageUploadWrapper: {
      marginBottom: 20,
    },
    imageUploadContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderColor: theme.colors.primary,
      borderRadius: 20,
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      overflow: 'hidden',
    },

    imageIconContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      height: 60,
      width: 60,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
    },
    buttonStyle: {
      borderColor: theme.colors.primary,
      backgroundColor: 'white',
      color: 'black',
    },
    buttonTextStyle: {
      color: theme.colors.primary,
    },
    hr: {
      height: 2,
      backgroundColor: theme.colors.lightGray,
      marginVertical: 20,
    },
    bottomContainer: {
      position: 'relative', // Allows it to move when the keyboard is open
      bottom: 0,
      left: 0,
      right: 0,
      padding: 15,
      borderTopWidth: 1,
      borderColor: '#ccc',
    },
    colorBlack: {
      color: 'white',
    },
    bottomBlack: {
      borderBottomColor: 'white',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      borderRadius: 5,
    },
    errorText: {
      color: '#d50000',
      marginTop: 5,
    },
    linearGradient: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 5,
      padding: 20,
    },
  });

export default NewDeclarationScreen;
