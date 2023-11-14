import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../features/Auth/screens/login.screen';
import WelcomeScreen from '../features/Auth/screens/welcome.screen';
import ChooseLanguageScreen from '../features/Auth/screens/chooseLanguage.screen';
import ChooseSettingsScreen from '../features/Auth/screens/chooseSettings.screen';
import RegisterScreen from '../features/Auth/screens/register.screen';

import { PinView } from '@src/components';
import useAuthStore from '@src/stores/useAuthStore';

const AuthNavigator = createStackNavigator();

const AuthStack = () => {
  const user = useAuthStore(state => state.user);

  return (
    <AuthNavigator.Navigator screenOptions={{ headerShown: false }}>
      {user && user.apuId ? (
        <>
          <AuthNavigator.Screen name="Login" component={LoginScreen} />
        </>
      ) : (
        <>
          <AuthNavigator.Screen name="Welcome" component={WelcomeScreen} />
          <AuthNavigator.Screen
            name="ChooseLanguage"
            component={ChooseLanguageScreen}
          />
          <AuthNavigator.Screen
            name="ChooseSettings"
            component={ChooseSettingsScreen}
          />
          <AuthNavigator.Screen
            name="RegisterLicense"
            component={RegisterScreen}
          />
        </>
      )}
      <AuthNavigator.Screen name="Pin" component={PinView} />
    </AuthNavigator.Navigator>
  );
};

export default AuthStack;
