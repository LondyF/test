import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';

import {AxiosError} from 'axios';
import {UseMutateFunction} from '@tanstack/react-query';
import {faPoliceBox, faUserNurse} from '@fortawesome/pro-solid-svg-icons';
import {useTranslation} from 'react-i18next';

import {Button, Typography, SelectInput} from '@src/components';
import {LovDoctor} from '@hooks/useFetchAllDoctors';
import {LovInsurer} from '@hooks/useFetchAllInsurers';

import {Action, ActionKind, Steps} from '../register.screen';
import {RegisterUserResponse} from '@hooks/useRegisterUser';

interface EnterInsuranceInfoStepProps {
  dispatch: React.Dispatch<Action>;
  registerUser: UseMutateFunction<
    RegisterUserResponse,
    AxiosError<RegisterUserResponse>,
    any,
    unknown
  >;
  user: User;
  insurers: Array<LovInsurer>;
  doctors: Array<LovDoctor>;
}

const EnterInsuranceInfoStep: React.FC<EnterInsuranceInfoStepProps> = ({
  dispatch,
  registerUser,
  user,
  insurers,
  doctors,
}) => {
  const {t} = useTranslation();
  const [selectedInsurerId, setSelectedInsurerId] = useState(insurers[0]?.id);
  const [selectedDoctorId, setSelectedDoctorId] = useState(0);

  const setStep = (step: Steps) =>
    dispatch({
      type: ActionKind.SET_STEP,
      payload: step,
    });

  const insurersOptions = insurers.map(x => {
    return {
      label: x.naam,
      value: x.id,
    };
  });

  const doctorsOptions = [
    {
      label: t('register.selectDoctor'),
      value: 0,
    },
    ...doctors
      .filter(x => x.lndKde === user.lndKde)
      .map(x => {
        return {
          label: x.naam,
          value: x.id,
        };
      }),
  ];

  const handleSubmit = () => {
    if (selectedDoctorId === 0) {
      return Alert.alert('Error', t('register.selectDoctorToContinue'));
    }

    dispatch({
      type: ActionKind.SET_BUSY,
      payload: true,
    });

    registerUser({
      firstName: user.firstName,
      name: user.naam,
      email: user.email,
      phoneNumber: user.sms,
      idNumber: user.idNummer,
      country: user.lndKde,
      address: user.adres,
      language: user.language,
      sex: user.sex,
      doctorId: selectedDoctorId,
      insuranceId: selectedInsurerId,
    });
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
          onValueChange={value => setSelectedInsurerId(value)}
          label={t('register.insurer')}
          labelStyle={styles.selectLabelStyle}
          inputIOSStyle={styles.colorWhite}
          inputAndroidStyle={styles.colorWhite}
          icon={faPoliceBox}
          iconStyle={styles.colorWhite}
          items={insurersOptions}
        />
        <SelectInput
          containerStyle={styles.alignStretch}
          bottomBorderStyle={styles.selectBorderBottomStyle}
          onValueChange={value => setSelectedDoctorId(value)}
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
          onPress={() => setStep(Steps.EnterContactInfo)}
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
