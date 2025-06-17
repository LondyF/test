import React from 'react';
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
import {faPlusCircle} from '@fortawesome/pro-light-svg-icons';
import {useFormik} from 'formik';
import {
  faCalendar,
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

type Props = {
  navigation: NavigationProp<{}>;
};

const NewDeclarationScreen = ({}: Props) => {
  const theme = useTheme();
  const user = useAuthStore(state => state.user);
  const {navigate} = useNavigation();
  const styles = makeStyles(theme);
  const toast = useToast();

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
        currency: 'XCG',
        country: 'CW',
        date: moment(new Date()).format('DD MMM YYYY'),
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

  const countryOptions = [{label: 'Curaçao', value: 'CW'}];

  const currencyOptions = [{label: 'Carribean Guilder', value: 'XCG'}];

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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.flex}>
            <KeyboardAwareScrollView
              style={styles.container}
              keyboardShouldPersistTaps="handled">
              <Typography variant="h2" text="Invoice" />
              <View style={styles.imageUploadWrapper}>
                <TouchableOpacity
                  style={styles.imageUploadContainer}
                  onPress={handlePhotoPress}>
                  {values.image ? (
                    <Image
                      source={{uri: values.image?.uri}}
                      style={styles.image}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faPlusCircle}
                      color={theme.colors.primary}
                      size={40}
                    />
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
              <Button
                buttonStyle={styles.buttonStyle}
                textStyle={styles.buttonTextStyle}
                variant="outline"
                text="Change Photo"
                onPress={() => {}}
              />
              <View style={styles.hr} />
              <Typography variant="h2" text="Info" />
              <TextInput
                label="Total Amount"
                mainColor="black"
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
              />
              <TextInput
                label="Date"
                mainColor="black"
                value={values.date}
                onChangeText={handleChange('date')}
                icon={faCalendar}
                autoCapitalize="none"
              />
              <SelectInput
                label={'Country'}
                onValueChange={value => {
                  if (value) {
                    setFieldValue('country', value);
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
              />
            </KeyboardAwareScrollView>
            <View style={styles.bottomContainer}>
              <Button
                loading={isPending}
                variant="primary"
                text="Submit"
                onPress={() => handleSubmit()}
                buttonStyle={styles.buttonStyle}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    imageUploadWrapper: {
      marginBottom: 20,
    },
    imageUploadContainer: {
      borderWidth: 5,
      borderStyle: 'dashed',
      borderColor: theme.colors.primary,
      borderRadius: 5,
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      overflow: 'hidden',
    },
    buttonStyle: {
      borderColor: theme.colors.primary,
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
      backgroundColor: 'white',
      padding: 15,
      borderTopWidth: 1,
      borderColor: '#ccc',
    },
    colorBlack: {
      color: 'black',
    },
    bottomBlack: {
      borderBottomColor: 'black',
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
  });

export default NewDeclarationScreen;
