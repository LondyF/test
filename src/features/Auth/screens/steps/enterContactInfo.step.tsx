import React from 'react';
import {View, StyleSheet} from 'react-native';

import {AxiosError} from 'axios';
import {UseMutateFunction} from '@tanstack/react-query';
import {faEnvelope} from '@fortawesome/pro-solid-svg-icons';
import {useFormik} from 'formik';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';

import {Button, PhoneNumberInput, TextInput, Typography} from '@src/components';
import {Theme} from '@src/styles';
import {RegisterUserResponse} from '@hooks/useRegisterUser';
import usePhoneCountries from '@hooks/usePhoneCountries';
import {phoneNumberSchema} from '@helpers/phoneNumber';

import {Action, ActionKind, Steps} from '../register.screen';

interface EnterContactInfoStepProps {
  dispatch: React.Dispatch<Action>;
  registerUser: UseMutateFunction<
    RegisterUserResponse,
    AxiosError<RegisterUserResponse>,
    any,
    unknown
  >;
  user: User;
}

const EnterContactInfoStep: React.FC<EnterContactInfoStepProps> = ({
  dispatch,
  registerUser,
  user,
}) => {
  const {t} = useTranslation();
  const {darkRed} = Theme.colors;
  const phoneCountries = usePhoneCountries();
  const {handleChange, handleSubmit, setFieldValue, values, errors} = useFormik({
    initialValues: {
      email: user.email,
      phoneNumber: user.sms ?? '',
    },
    onSubmit: submitForm,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t('register.notValidEmail'))
        .required(t('register.emailRequired')),
      phoneNumber: phoneNumberSchema(t, {
        countries: phoneCountries,
        requiredMessage: t('register.phoneNumberRequired'),
      }),
    }),
  });

  function submitForm({
    email,
    phoneNumber,
  }: {
    email: string;
    phoneNumber: string;
  }) {
    dispatch({
      type: ActionKind.SET_USER,
      payload: {
        ...user,
        email,
        sms: phoneNumber,
      },
    });

    dispatch({
      type: ActionKind.SET_BUSY,
      payload: true,
    });

    registerUser({
      firstName: user.firstName,
      name: user.naam,
      email,
      phoneNumber,
      idNumber: user.idNummer,
      country: user.lndKde,
      address: user.adres,
      language: user.language,
      sex: user.sex,
      doctorId: user.sqArtId,
      insuranceId: user.vzkId,
      idType: user.idType,
      svbNumber: user.svb001 != null ? String(user.svb001) : undefined,
    });
  }

  const handleChangePhoneNumber = (phoneNumber: string) =>
    setFieldValue('phoneNumber', phoneNumber, false);

  const setStep = (step: Steps) =>
    dispatch({
      type: ActionKind.SET_STEP,
      payload: step,
    });

  return (
    <View style={styles.container}>
      <Typography
        variant="b1"
        fontWeight="bold"
        color="white"
        align="center"
        text={t('register.enterContactInfo')}
      />
      <TextInput
        mainColor="white"
        icon={faEnvelope}
        onChangeText={handleChange('email')}
        error={errors.email}
        value={values.email}
        errorColor={darkRed}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        labelFontSize={10}
        label={t('register.email')}
        keyboardType="email-address"
      />
      <PhoneNumberInput
        mainColor="white"
        onChangeText={handleChangePhoneNumber}
        error={errors.phoneNumber}
        value={values.phoneNumber}
        residenceCode={user.lndKde}
        errorColor={darkRed}
        labelFontSize={10}
        label={t('register.phoneNumber')}
      />
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => setStep(Steps.EnterInsuranceInfo)}
          variant="transparent"
          text={t('register.back')}
        />
        <Button
          onPress={handleSubmit}
          variant="secondary"
          text={t('register.next')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
});

export default EnterContactInfoStep;
