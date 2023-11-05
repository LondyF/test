import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {useFormik} from 'formik';
import {useTranslation} from 'react-i18next';
import {UseMutateFunction} from '@tanstack/react-query';
import {AxiosError} from 'axios';

import {
  faUser,
  faAddressCard,
  faIdBadge,
} from '@fortawesome/pro-solid-svg-icons';
import * as Yup from 'yup';

import {
  Typography,
  TextInput,
  Button,
  RadioButtonGroup,
  RadioButton,
} from '@src/components';
import {Action, ActionKind, Steps} from '../register.screen';
import {Theme} from '@src/styles';

interface EnterPersonalInfoStepProps {
  dispatch: React.Dispatch<Action>;
  checkSedula: UseMutateFunction<
    CheckSedulaResponse,
    AxiosError<CheckSedulaResponse>,
    any,
    unknown
  >;
  user: User;
}

const EnterPersonalInfoStep: React.FC<EnterPersonalInfoStepProps> = ({
  dispatch,
  checkSedula,
  user,
}) => {
  const {t} = useTranslation();
  const {darkRed} = Theme.colors;
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const {handleChange, handleSubmit, values, errors} = useFormik({
    initialValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.naam ?? '',
      address: user.adres,
      idNumber: user.idNummer,
    },
    onSubmit: submitForm,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: Yup.object({
      firstName: Yup.string().required(t('register.nameRequired')),
      lastName: Yup.string().required(t('register.lastNameRequired')),
      address: Yup.string().required(t('register.addressRequired')),
      idNumber: Yup.number()
        .typeError(t('register.idExistOfNumbers'))
        .required(t('register.idRequired'))
        .test(
          'len',
          t('register.idLength'),
          val => val?.toString().length === 10,
        ),
    }),
  });

  const GENDERS = [t('register.man'), t('register.female')];

  function submitForm({
    firstName,
    lastName,
    address,
    idNumber,
  }: {
    firstName: string;
    lastName: string;
    address: string;
    idNumber: string;
  }) {
    dispatch({
      type: ActionKind.SET_BUSY,
      payload: true,
    });

    const newUser: User = {
      ...user,
      firstName: firstName.trim(),
      naam: lastName.trim(),
      adres: address,
      idNummer: idNumber,
      sex: GENDERS[selectedOptionIndex] === 'Man' ? 'M' : 'F',
    };

    checkSedula({sedula: idNumber, taal: user.lang});
    dispatch({
      type: ActionKind.SET_USER,
      payload: newUser,
    });
  }

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
        text={t('register.enterPersonalInfo')}
      />
      <TextInput
        mainColor="white"
        onChangeText={handleChange('firstName')}
        icon={faUser}
        value={values.firstName}
        labelFontSize={10}
        error={errors.firstName}
        errorColor={darkRed}
        label={t('register.firstName')}
      />
      <TextInput
        mainColor="white"
        onChangeText={handleChange('lastName')}
        icon={faUser}
        value={values.lastName}
        labelFontSize={10}
        error={errors.lastName}
        errorColor={darkRed}
        label={t('register.lastName')}
      />
      <TextInput
        mainColor="white"
        onChangeText={handleChange('address')}
        icon={faAddressCard}
        labelFontSize={10}
        value={values.address}
        errorColor={darkRed}
        error={errors.address}
        label={t('register.address')}
      />
      <TextInput
        mainColor="white"
        onChangeText={handleChange('idNumber')}
        icon={faIdBadge}
        labelFontSize={10}
        value={values.idNumber}
        error={errors.idNumber}
        errorColor={darkRed}
        label={t('register.idNumber')}
        keyboardType="number-pad"
      />

      <Typography
        textStyle={styles.genderTitle}
        align="left"
        variant="h4"
        color="white"
        fontWeight="bold"
        text={t('register.gender')}
      />

      <RadioButtonGroup
        containerStyle={styles.radioButtonsContainer}
        optionContainerStyle={styles.optionContainerStyle}
        renderOption={(option, isSelected, index) => (
          <RadioButton
            onPress={() => setSelectedOptionIndex(index)}
            isSelected={isSelected}
            labelColor="white"
            buttonColor="white"
            label={option}
          />
        )}
        selectedOptionIndex={selectedOptionIndex}
        options={GENDERS}
      />

      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            dispatch({type: ActionKind.END_IN_APP_REGISTRATION, payload: ''});
            setStep(Steps.Start);
          }}
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
  radioButtonsContainer: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  optionContainerStyle: {
    marginBottom: 10,
  },
  genderTitle: {
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 0,
  },
});

export default EnterPersonalInfoStep;
