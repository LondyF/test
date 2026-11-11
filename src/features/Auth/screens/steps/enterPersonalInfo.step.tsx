import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {useFormik} from 'formik';
import {useTranslation} from 'react-i18next';

import {faUser, faAddressCard} from '@fortawesome/pro-solid-svg-icons';
import * as Yup from 'yup';

import {
  Typography,
  TextInput,
  Button,
  RadioButtonGroup,
  RadioButton,
} from '@src/components';
import {COUNTRIES} from '@src/constants';
import {Action, ActionKind, Steps} from '../register.screen';
import {Theme} from '@src/styles';

interface EnterPersonalInfoStepProps {
  dispatch: React.Dispatch<Action>;
  user: User;
}

const COUNTRY_LABELS = COUNTRIES.map(x => x.name);

const getInitialCountryIndex = (lndKde?: string) =>
  Math.max(
    COUNTRIES.findIndex(x => x.abbreviation === lndKde),
    0,
  );

const EnterPersonalInfoStep: React.FC<EnterPersonalInfoStepProps> = ({
  dispatch,
  user,
}) => {
  const {t} = useTranslation();
  const {darkRed} = Theme.colors;
  const [selectedGenderIndex, setSelectedGenderIndex] = useState(
    user?.sex === 'F' ? 1 : 0,
  );
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(
    getInitialCountryIndex(user?.lndKde),
  );
  const {handleChange, handleSubmit, values, errors} = useFormik({
    initialValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.naam ?? '',
      address: user?.adres ?? '',
    },
    onSubmit: submitForm,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: Yup.object({
      firstName: Yup.string().required(t('register.nameRequired')),
      lastName: Yup.string().required(t('register.lastNameRequired')),
      address: Yup.string().required(t('register.addressRequired')),
    }),
  });

  const GENDERS = [t('register.man'), t('register.female')];

  function submitForm({
    firstName,
    lastName,
    address,
  }: {
    firstName: string;
    lastName: string;
    address: string;
  }) {
    const newUser: User = {
      ...user,
      firstName: firstName.trim(),
      naam: lastName.trim(),
      adres: address,
      sex: selectedGenderIndex === 0 ? 'M' : 'F',
      lndKde: COUNTRIES[selectedCountryIndex].abbreviation,
    };

    dispatch({
      type: ActionKind.SET_USER,
      payload: newUser,
    });

    setStep(Steps.EnterInsuranceInfo);
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

      <Typography
        textStyle={styles.sectionTitle}
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
            onPress={() => setSelectedGenderIndex(index)}
            isSelected={isSelected}
            labelColor="white"
            buttonColor="white"
            label={option}
          />
        )}
        selectedOptionIndex={selectedGenderIndex}
        options={GENDERS}
      />

      <Typography
        textStyle={styles.sectionTitle}
        align="left"
        variant="h4"
        color="white"
        fontWeight="bold"
        text={t('register.country')}
      />

      <RadioButtonGroup
        containerStyle={styles.radioButtonsContainer}
        optionContainerStyle={styles.optionContainerStyle}
        renderOption={(option, isSelected, index) => (
          <RadioButton
            onPress={() => setSelectedCountryIndex(index)}
            isSelected={isSelected}
            labelColor="white"
            buttonColor="white"
            label={option}
          />
        )}
        selectedOptionIndex={selectedCountryIndex}
        options={COUNTRY_LABELS}
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
  sectionTitle: {
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 0,
  },
});

export default EnterPersonalInfoStep;
