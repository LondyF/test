import React from 'react';
import {View, StyleSheet} from 'react-native';

import {faKey} from '@fortawesome/pro-solid-svg-icons';
import {useFormik} from 'formik';
import {UseMutateFunction} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {useTranslation} from 'react-i18next';

import {Typography, Button, TextInput} from '@src/components';
import {getDeviceInfo} from '@utils/deviceInfo';

import {ActionKind, Action, Steps} from '../register.screen';

interface EnterLicenseManuallyStepProps {
  dispatch: React.Dispatch<Action>;
  lang: Language['abbreviation'];
  submit: UseMutateFunction<
    ValidateLicenseResponse,
    AxiosError<ValidateLicenseResponse>,
    any,
    unknown
  >;
}

const EnterLicenseManuallyStep: React.FC<EnterLicenseManuallyStepProps> = ({
  dispatch,
  lang,
  submit,
}) => {
  const {t} = useTranslation();
  const {handleChange, handleSubmit} = useFormik({
    initialValues: {license: ''},
    onSubmit: submitForm,
  });

  async function submitForm({license}: {license: string}) {
    dispatch({
      type: ActionKind.VALIDATE_LICENSE,
      payload: license,
    });

    return submit({license, lang, device: await getDeviceInfo()});
  }

  return (
    <View style={styles.container}>
      <Typography
        variant="b1"
        fontWeight="bold"
        color="white"
        text={t('register.enterLicenseManually')}
      />
      <TextInput
        mainColor="white"
        onChangeText={handleChange('license')}
        icon={faKey}
        contextMenuHidden={false}
        autoCapitalize="none"
      />
      <Button
        variant="secondary"
        text={t('register.next')}
        buttonStyle={styles.button}
        onPress={() => handleSubmit()}
      />
      <Button
        variant="transparent"
        text={t('register.back')}
        onPress={() =>
          dispatch({
            type: ActionKind.SET_STEP,
            payload: Steps.Start,
          })
        }
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

export default EnterLicenseManuallyStep;
