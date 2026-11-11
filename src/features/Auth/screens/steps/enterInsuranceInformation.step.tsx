import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';

import {AxiosError} from 'axios';
import {UseMutateFunction} from '@tanstack/react-query';
import {
  faIdBadge,
  faPoliceBox,
  faUserNurse,
} from '@fortawesome/pro-solid-svg-icons';
import {useFormik} from 'formik';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';

import {
  Button,
  Typography,
  SelectInput,
  TextInput,
  SvbNumberInput,
} from '@src/components';
import {Theme} from '@src/styles';
import {LovDoctor} from '@hooks/useFetchAllDoctors';
import {LovInsurer} from '@hooks/useFetchAllInsurers';
import {getIdTypeTranslationKeys, getInsurerIdType} from '@helpers/idType';
import {
  getSvbNumberLastDigit,
  getSvbNumberPrefix,
  sanitizeSvbNumberLastDigit,
} from '@helpers/svbNumber';

import {Action, ActionKind, Steps} from '../register.screen';

interface EnterInsuranceInfoStepProps {
  dispatch: React.Dispatch<Action>;
  checkSedula: UseMutateFunction<
    CheckSedulaResponse,
    AxiosError<CheckSedulaResponse>,
    any,
    unknown
  >;
  user: User;
  insurers: Array<LovInsurer>;
  doctors: Array<LovDoctor>;
}

const EnterInsuranceInfoStep: React.FC<EnterInsuranceInfoStepProps> = ({
  dispatch,
  checkSedula,
  user,
  insurers,
  doctors,
}) => {
  const {t} = useTranslation();
  const {darkRed} = Theme.colors;
  const [selectedInsurerId, setSelectedInsurerId] = useState(user.vzkId ?? 0);
  const [selectedDoctorId, setSelectedDoctorId] = useState(user.sqArtId ?? 0);
  const [svbNumberLastDigit, setSvbNumberLastDigit] = useState(
    getSvbNumberLastDigit(user.svb001),
  );

  const selectedInsurer = insurers.find(x => x.id === selectedInsurerId);
  const idType = getInsurerIdType(selectedInsurer);
  const idTranslationKeys = getIdTypeTranslationKeys(idType);
  const isSvbInsurer = selectedInsurer?.useSvb001 === 1;

  const {handleChange, handleSubmit, values, errors} = useFormik({
    initialValues: {
      idNumber: user.idNummer ?? '',
    },
    onSubmit: submitForm,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: Yup.object({
      idNumber: Yup.number()
        .typeError(t(idTranslationKeys.existOfNumbers))
        .required(t(idTranslationKeys.required))
        .test(
          'len',
          t(idTranslationKeys.length),
          val => val?.toString().length === 10,
        ),
    }),
  });

  const setStep = (step: Steps) =>
    dispatch({
      type: ActionKind.SET_STEP,
      payload: step,
    });

  const insurersOptions = insurers.map(x => ({
    label: x.naam.trim(),
    value: x.id,
  }));

  const doctorsOptions = [
    {
      label: t('register.selectDoctor'),
      value: 0,
    },
    ...doctors
      .filter(x => x.lndKde === user.lndKde)
      .map(x => ({
        label: x.naam,
        value: x.id,
      })),
  ];

  function submitForm({idNumber}: {idNumber: string}) {
    if (!selectedInsurer) {
      return;
    }

    const svbNumber = isSvbInsurer
      ? `${getSvbNumberPrefix(idNumber)}${svbNumberLastDigit || '0'}`
      : undefined;

    dispatch({
      type: ActionKind.SET_USER,
      payload: {
        ...user,
        idNummer: idNumber,
        idType,
        vzkId: selectedInsurer.id,
        vzkNaam: selectedInsurer.naam.trim(),
        sqArtId: selectedDoctorId,
        svb001: svbNumber,
      },
    });

    dispatch({
      type: ActionKind.SET_BUSY,
      payload: true,
    });

    checkSedula({
      sedula: idNumber,
      lang: user.language,
      insuranceId: selectedInsurer.id,
      idType,
    });
  }

  const handleNext = () => {
    if (!selectedInsurer) {
      return Alert.alert('Error', t('register.selectInsurer'));
    }

    if (selectedDoctorId === 0) {
      return Alert.alert('Error', t('register.selectDoctorToContinue'));
    }

    handleSubmit();
  };

  const handleInsurerChange = (value: number | null) => {
    setSelectedInsurerId(value ?? 0);
  };

  const handleDoctorChange = (value: number | null) => {
    setSelectedDoctorId(value ?? 0);
  };

  const handleSvbNumberLastDigitChange = (value: string) => {
    setSvbNumberLastDigit(sanitizeSvbNumberLastDigit(value));
  };

  return (
    <View style={styles.container}>
      <Typography
        variant="b1"
        fontWeight="bold"
        color="white"
        align="center"
        text={t('register.chooseInsurerAndDoctor')}
      />
      <View style={styles.alignStretch}>
        <SelectInput
          containerStyle={styles.alignStretch}
          bottomBorderStyle={styles.selectBorderBottomStyle}
          onValueChange={handleInsurerChange}
          value={selectedInsurerId}
          label={t('register.insurer')}
          placeholder={{
            label: t('register.selectInsurer'),
            value: 0,
          }}
          labelStyle={styles.selectLabelStyle}
          inputIOSStyle={styles.colorWhite}
          inputAndroidStyle={styles.colorWhite}
          icon={faPoliceBox}
          iconStyle={styles.colorWhite}
          items={insurersOptions}
        />
        {selectedInsurer && (
          <TextInput
            mainColor="white"
            onChangeText={handleChange('idNumber')}
            icon={faIdBadge}
            labelFontSize={10}
            value={values.idNumber}
            error={errors.idNumber}
            errorColor={darkRed}
            label={t(idTranslationKeys.registerLabel)}
            keyboardType="number-pad"
          />
        )}
        {isSvbInsurer && (
          <TextInput
            mainColor="white"
            textColor="white"
            icon={faIdBadge}
            iconStyle={styles.colorWhite}
            labelFontSize={10}
            label={t('register.svbNumber')}
            value={svbNumberLastDigit}
            onChangeText={handleSvbNumberLastDigitChange}
            InputComponent={SvbNumberInput}
            prefix={getSvbNumberPrefix(values.idNumber)}
            keyboardType="number-pad"
          />
        )}
        <SelectInput
          containerStyle={styles.alignStretch}
          bottomBorderStyle={styles.selectBorderBottomStyle}
          onValueChange={handleDoctorChange}
          value={selectedDoctorId}
          placeholder={{}}
          label={t('register.familyDoctor')}
          labelStyle={styles.selectLabelStyle}
          inputIOSStyle={styles.colorWhite}
          inputAndroidStyle={styles.colorWhite}
          icon={faUserNurse}
          iconStyle={styles.colorWhite}
          items={doctorsOptions}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => setStep(Steps.EnterPersonalInfo)}
          variant="transparent"
          text={t('register.back')}
        />
        <Button
          onPress={handleNext}
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
    justifyContent: 'space-around',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  colorWhite: {
    color: 'white',
  },
  selectLabelStyle: {
    color: 'white',
    fontWeight: 'normal',
  },
  alignStretch: {
    alignSelf: 'stretch',
  },
  selectBorderBottomStyle: {
    borderBottomColor: 'white',
  },
});

export default EnterInsuranceInfoStep;
