import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {faEnvelope, faPhoneAlt} from '@fortawesome/pro-solid-svg-icons';
import {useFormik} from 'formik';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';

import {
  Button,
  RadioButton,
  RadioButtonGroup,
  TextInput,
  Typography,
} from '@src/components';
import {Theme} from '@src/styles';
import {COUNTRIES} from '@src/constants';

import {Action, ActionKind, Steps} from '../register.screen';

interface EnterContactInfoStepProps {
  dispatch: React.Dispatch<Action>;
  user: User;
}

const EnterContactInfoStep: React.FC<EnterContactInfoStepProps> = ({
  dispatch,
  user,
}) => {
  const COUNTRIESLABELS = COUNTRIES.map(x => x.name);

  const {t} = useTranslation();
  const {darkRed} = Theme.colors;
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(
    COUNTRIES.findIndex(
      x => x.abbreviation === (user?.lndKde ?? COUNTRIES[0].abbreviation),
    ),
  );
  const {handleChange, handleSubmit, values, errors} = useFormik({
    initialValues: {
      email: user.email,
      phoneNumber: user.sms ?? COUNTRIES[selectedOptionIndex].prefix,
    },
    onSubmit: submitForm,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t('register.notValidEmail'))
        .required(t('register.emailRequired')),
      phoneNumber: Yup.string()
        .min(10, t('register.phoneNumberLength'))
        .max(11, t('register.phoneNumberLength'))
        .required(t('register.phoneNumberRequired')),
    }),
  });

  function submitForm({
    email,
    phoneNumber,
  }: {
    email: string;
    phoneNumber: string;
  }) {
    const selectedCountry = COUNTRIES[selectedOptionIndex];
    const newUser: User = {
      ...user,
      email,
      sms: phoneNumber,
      lndKde: selectedCountry.abbreviation as string,
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
        labelFontSize={10}
        label={t('register.email')}
        keyboardType="email-address"
      />
      <TextInput
        mainColor="white"
        icon={faPhoneAlt}
        onChangeText={handleChange('phoneNumber')}
        error={errors.phoneNumber}
        value={values.phoneNumber}
        errorColor={darkRed}
        labelFontSize={10}
        label={t('register.phoneNumber')}
        keyboardType="number-pad"
      />
      <Typography
        textStyle={styles.countryTitle}
        align="left"
        variant="h4"
        color="white"
        fontWeight="bold"
        text={t('register.country')}
      />
      <RadioButtonGroup
        containerStyle={styles.radioButtonsContainer}
        optionContainerStyle={styles.optionContainerStyle}
        options={COUNTRIESLABELS}
        selectedOptionIndex={selectedOptionIndex}
        renderOption={(option, isSelected, index) => (
          <RadioButton
            onPress={() => setSelectedOptionIndex(index)}
            isSelected={isSelected}
            labelColor="white"
            buttonColor="white"
            label={option}
          />
        )}
      />
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => setStep(Steps.EnterPersonalInfo)}
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
  countryTitle: {
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 0,
  },
});

export default EnterContactInfoStep;
