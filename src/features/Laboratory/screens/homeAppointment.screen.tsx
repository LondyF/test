import React, {useState, useEffect} from 'react';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {LabRequest} from '../types/laboratory';
import useAuthStore from '@src/stores/useAuthStore';
import useFetchHomeAppointment from '../hooks/useFetchHomeAppointment';
import {
  PageContainer,
  Typography,
  SelectInput,
  TextInput,
  ErrorView,
  Loader,
  Button,
} from '@src/components';
import useTheme from '@src/hooks/useTheme';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Item} from 'react-native-picker-select';
import {StyleSheet, View} from 'react-native';
import {Theme} from '@src/styles/styles';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useTranslation} from 'react-i18next';
import useBookHomeAppointment from '../hooks/useBookHomeAppointment';
import useToast from '@src/components/Toast/useToast';
import {ToastTypes} from '@src/components/Toast/toastTypes';

interface Props {
  route: RouteProp<
    {params: {labRequest: LabRequest; mdsId?: number}},
    'params'
  >;
}

const HomeAppointment: React.FC<Props> = ({route}) => {
  const {labRequest} = route.params;
  const [availableLabs, setAvailableLabs] = useState<Item[]>([]);
  const [selectedLab, setSelectedLab] = useState<number>(0);
  const appTheme = useTheme();
  const styles = makeStyles(appTheme);
  const {t} = useTranslation();
  const Toast = useToast();
  const {goBack} = useNavigation();

  const user = useAuthStore(state => state.user);
  const {data, isLoading, error, refetch, isError} = useFetchHomeAppointment(
    user?.apuId || 0,
    labRequest.avaId,
    route.params.mdsId,
  );
  const {mutateAsync, isLoading: isBookingAppointment} =
    useBookHomeAppointment();

  useEffect(() => {
    if (!isLoading && data) {
      setAvailableLabs(
        data?.labs?.map<Item>(lab => ({
          label: lab.naamFull,
          value: lab.id,
        })),
      );
    }
  }, [data, isLoading]);

  const {handleSubmit, values, errors, handleChange} = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      name: data?.userInfo?.name,
      email: data?.userInfo?.email,
      phoneNumber: data?.userInfo?.phoneNumber,
      address: data?.userInfo?.address,
    },

    validationSchema: Yup.object({
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
    onSubmit: async ({address, name, phoneNumber, email}) => {
      const response = await mutateAsync({
        address: address || '',
        phoneNumber: phoneNumber || '',
        email: email || '',
        apuId: user!.apuId,
        name: name || '',
        avaId: labRequest.avaId,
        labId: selectedLab,
        mdsId: route.params.mdsId,
      });

      if (response.status.status === 0) {
        Toast(response.status.msg, ToastTypes.SUCCESS);
        goBack();
      } else {
        Toast(response.status.msg, ToastTypes.ERROR);
      }
    },
  });

  if (isLoading || isBookingAppointment) {
    return (
      <Loader
        textColor={appTheme.colors.primary}
        indicatorColor={appTheme.colors.primary}
        text="loading..."
      />
    );
  }

  if ((data && !data.labs) || isError) {
    return <ErrorView error={error} reload={refetch} goBack={goBack} />;
  }

  return (
    <PageContainer style={styles.pageContainer}>
      <KeyboardAwareScrollView
        extraScrollHeight={100}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        <Typography
          textStyle={styles.descriptionText}
          align="center"
          variant="b1"
          text={t('labRequests.homeAppointmentDescription')}
        />
        <View style={styles.box}>
          <SelectInput
            value={selectedLab}
            labelStyle={styles.blackColor}
            bottomBorderStyle={styles.bottomBorderStyle}
            label={t('labRequests.availableLabs')}
            onValueChange={value => setSelectedLab(value)}
            items={availableLabs}
          />
          <TextInput
            value={values.name}
            error={errors.name}
            label={t('profile.name')}
            errorColor="red"
            onChangeText={handleChange('name')}
            mainColor="black"
          />
          <TextInput
            value={values.address}
            label={t('labRequests.appointmentLocation')}
            onChangeText={handleChange('address')}
            error={errors.address}
            errorColor="red"
            mainColor="black"
          />
          <TextInput
            value={values.phoneNumber}
            onChangeText={handleChange('phoneNumber')}
            error={errors.phoneNumber}
            label={t('profile.phoneNumber')}
            errorColor="red"
            mainColor="black"
          />
          <TextInput
            value={values.email}
            error={errors.email}
            onChangeText={handleChange('email')}
            label={t('profile.email')}
            errorColor="red"
            mainColor="black"
          />
        </View>
        <Button
          onPress={handleSubmit}
          buttonStyle={styles.button}
          text={t('labRequests.bookAppointment')}
        />
      </KeyboardAwareScrollView>
    </PageContainer>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    blackColor: {
      color: 'black',
      fontWeight: 'normal',
    },
    scrollView: {
      flexGrow: 1,
    },
    bottomBorderStyle: {
      borderBottomColor: 'black',
    },
    descriptionText: {
      marginVertical: 20,
    },
    button: {
      marginTop: 30,
    },
    box: {
      backgroundColor: 'white',
      borderRadius: 10,
      paddingHorizontal: theme.spacing.horizontalPadding,
      paddingVertical: theme.spacing.verticalPadding,
      borderWidth: 1,
      borderColor: theme.colors.lightGray,
    },
    pageContainer: {
      padding: 20,
    },
  });

export default HomeAppointment;
