import React from 'react';
import {View, StyleSheet} from 'react-native';

import {UseMutateFunction} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {faComment} from '@fortawesome/pro-solid-svg-icons';
import {useTranslation} from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from 'yup';

import {ActionKind, Action} from '../register.screen';

import {Button, TextInput, Typography} from '@src/components';
import {Theme} from '@styles/index';
import {getDeviceInfo} from '@utils/deviceInfo';

interface VerifyPhoneNumberStepProps {
  dispatch: React.Dispatch<Action>;
  license: String;
  apuId: Number;
  submit: UseMutateFunction<
    ValidateLicenseResponse,
    AxiosError<ValidateLicenseResponse>,
    any,
    unknown
  >;
}

const VerifyPhoneNumberStep: React.FC<VerifyPhoneNumberStepProps> = ({
  dispatch,
  license,
  apuId,
  submit,
}) => {
  const {t} = useTranslation();
  const {handleChange, handleSubmit, errors} = useFormik({
    initialValues: {smsCode: ''},
    validationSchema: Yup.object({
      smsCode: Yup.string().required(t('validators.requiredField')),
    }),
    onSubmit: submitForm,
  });

  async function submitForm({smsCode}: {smsCode: string}) {
    dispatch({
      type: ActionKind.SET_BUSY,
      payload: true,
    });

    return submit({smsCode, apuId, license, device: await getDeviceInfo()});
  }

  return (
    <View style={styles.container}>
      <Typography
        align="center"
        variant="b1"
        fontWeight="bold"
        color="white"
        text={t('register.smsSent')}
      />
      <TextInput
        mainColor="white"
        onChangeText={handleChange('smsCode')}
        icon={faComment}
        autoCapitalize="none"
        error={errors.smsCode}
        errorColor={Theme.colors.darkRed}
        contextMenuHidden={false}
      />
      <Button
        variant="secondary"
        text={t('register.next')}
        buttonStyle={styles.button}
        onPress={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 50,
  },
  button: {
    alignSelf: 'stretch',
  },
});

export default VerifyPhoneNumberStep;
