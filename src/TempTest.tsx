import React from 'react';
import { View } from 'react-native';
import { Typography, Button } from './components';

import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '@stores/useAuthStore';

import { getUniqueId } from 'react-native-device-info';

const TempTestScreen: React.FC = () => {
  const { navigate } = useNavigation();
  const { t, i18n } = useTranslation();
  const clearAuthStore = useAuthStore((store) => store.clearAuthStore);

  const id = getUniqueId();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Typography
        textStyle={{
          position: 'absolute',
          zIndex: -5,
          top: 50,
          right: 10,
          transform: [{ rotate: '35deg' }],
        }}
        variant="h1"
        color="red"
        fontWeight="bold"
        text="TEST"
      />
      <Typography variant="b1" text={id} />
      <Typography variant="b2" text={t('dashboard.welcome')} />
      <Button text="CHANGE THE LANG" onPress={() => i18n.changeLanguage('CH')} />
      <Typography textStyle={{ marginBottom: 100 }} variant="h1" text="Choose your action" />
      <Button
        onPress={() => {
          clearAuthStore();
          navigate('Welcome');
        }}
        text="Register Account"
      />
      <Typography variant="b1" text="Or" />
      <Button onPress={() => navigate('Login')} text="Login" />
    </View>
  );
};

export default TempTestScreen;
