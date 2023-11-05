import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {useTranslation} from 'react-i18next';

import {Theme} from '@styles/index';
import {PageContainer, Typography, Button} from '@components/index';
import usePermissions, {Permissions} from '@src/hooks/usePermissions';
import useAuthStore from '@stores/useAuthStore';

import Box from '../components/box';
import Header from '../components/header';
import PermissionItem from '../components/permissionItem';

const ChooseSettingsScreen: React.FC = () => {
  const {navigate} = useNavigation();
  const {t} = useTranslation();
  const [user, setUser] = useAuthStore(state => [state.user, state.setUser]);

  const [hasCameraPerms, requestCameraPermissions] = usePermissions(
    Permissions.camera,
  );
  const [hasBiometricsPerms, requestBiometricsPermissions] = usePermissions(
    Permissions.faceId,
  );
  const [hasLocationPerms, requestLocationPermissions] = usePermissions(
    Permissions.location,
  );

  const [allowCamera, setAllowCamera] = useState<boolean>(false);
  const [allowBiometrics, setAllowbiometircs] = useState<boolean>(false);
  const [allowLocation, setAllowLocation] = useState<boolean>(false);

  useEffect(() => {
    setUser({
      ...user,
      cameraEnabled: allowCamera && hasCameraPerms,
    } as User);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowCamera, hasCameraPerms, setUser]);

  useEffect(() => {
    setUser({
      ...user,
      locationEnabled: allowLocation && hasLocationPerms,
    } as User);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLocationPerms, allowLocation, setUser]);

  useEffect(() => {
    setUser({
      ...user,
      biometricEnabled: allowBiometrics && hasBiometricsPerms,
    } as User);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowBiometrics, hasBiometricsPerms, setUser]);

  const handleCameraToggle = async (switchValue: boolean) => {
    if (switchValue) {
      await requestCameraPermissions();
    }
    setAllowCamera(switchValue);
  };

  const handleLocationToggle = async (switchValue: boolean) => {
    if (switchValue) {
      await requestLocationPermissions();
    }

    setAllowLocation(switchValue);
  };

  const handleBiometricToggle = async (switchValue: boolean) => {
    if (switchValue) {
      await requestBiometricsPermissions();
    }
    setAllowbiometircs(switchValue);
  };

  return (
    <PageContainer>
      <View style={styles.container}>
        <Header variant="blue" />
        <View style={styles.content}>
          <Typography
            variant="h1"
            text={t('chooseSettings.chooseYourSettings')}
            color={Theme.colors.primary}
            align="center"
            textStyle={styles.chooseYourSettings}
          />
          <Typography
            variant="b1"
            text={t('chooseSettings.info')}
            align="center"
          />
          <Box style={styles.contentBox}>
            <Typography
              text={t('chooseSettings.permission')}
              variant="b1"
              fontWeight="bold"
              textStyle={styles.permissions}
            />
            <PermissionItem
              permission={t('chooseSettings.camera')}
              allowed={allowCamera && hasCameraPerms}
              change={handleCameraToggle}
            />
            <PermissionItem
              permission={t('chooseSettings.location')}
              allowed={allowLocation && hasLocationPerms}
              change={handleLocationToggle}
            />
            <PermissionItem
              permission={t('chooseSettings.biometric')}
              allowed={allowBiometrics && hasBiometricsPerms}
              change={handleBiometricToggle}
            />
          </Box>
        </View>
        <Button
          buttonStyle={styles.button}
          text={t('chooseSettings.continue')}
          onPress={() => navigate('RegisterLicense')}
        />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 25,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -50,
  },
  contentBox: {
    marginVertical: 55,
    marginHorizontal: 25,
  },
  chooseYourSettings: {
    marginBottom: 20,
  },
  permissions: {
    marginBottom: 10,
  },
  button: {
    alignSelf: 'stretch',
  },
});

export default ChooseSettingsScreen;
