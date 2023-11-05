import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';

import {useTranslation} from 'react-i18next';

import usePermissions, {Permissions} from '@hooks/usePermissions';
import {Button, Typography} from '@components/index';

import {ActionKind, Steps, Action} from '../register.screen';

interface StartStepProps {
  dispatch: React.Dispatch<Action>;
}

const StartStep: React.FC<StartStepProps> = ({dispatch}) => {
  const {t} = useTranslation();
  const [hasCameraPermission] = usePermissions(Permissions.camera);

  const handleScanQRButton = () => {
    if (hasCameraPermission) {
      dispatch({type: ActionKind.TOGGLE_SCANNER, payload: true});
    } else {
      Alert.alert(
        'Oops, something went wrong!',
        "We don't have permissions to your camera, please open your settings and turn camera permissions on",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Typography
        variant="b1"
        color="white"
        fontWeight="bold"
        align="center"
        text={t('register.explanation')}
      />
      <View style={styles.actionContainer}>
        <Button
          onPress={() =>
            dispatch({type: ActionKind.START_IN_APP_REGISTRATION, payload: ''})
          }
          variant="secondary"
          text={t('register.registerViaApp')}
        />
        <Typography
          variant="h5"
          text={t('register.or')}
          color="white"
          fontWeight="bold"
        />
        <Button
          onPress={handleScanQRButton}
          variant="outline"
          text={t('register.scanQRCode')}
        />
        <Button
          onPress={() =>
            dispatch({
              type: ActionKind.SET_STEP,
              payload: Steps.EnterLicenseManually,
            })
          }
          variant="transparent"
          textStyle={styles.enterLicenseManually}
          text={t('register.manuallyEnterLicense')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionContainer: {
    paddingTop: 50,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  enterLicenseManually: {
    fontStyle: 'italic',
  },
});

export default StartStep;
