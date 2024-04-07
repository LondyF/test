import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {ValidationStatus} from '@src/types/validationStatus';
import ReuploadValidationPhoto from '@src/features/Auth/screens/reuploadValidationPhoto.screen';
import ReuploadValidationPhotoOnfido from '@src/features/Auth/screens/reuploadValidationPhotoOnfido.screen';

import useAuthStore from '@stores/useAuthStore';

import AuthStack from './auth-navigator';
import AppStack from './app-navigator';
import {StatusBar} from 'react-native';
import {INSURERS} from '@src/constants';

const RootNavigator = createStackNavigator();

const RootStack: React.FC = () => {
  const [isAuthenticated, user] = useAuthStore(state => [
    state.isAuthenticated,
    state.user,
  ]);

  const showOnfidoScreen = user?.needPhotoId === 2;
  const hasToReuploadValidationPhoto =
    user?.validationStatus === ValidationStatus.VALIDATION_PHOTO_NEEDED;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <RootNavigator.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          <RootNavigator.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            {!hasToReuploadValidationPhoto ? (
              <RootNavigator.Screen name="App" component={AppStack} />
            ) : (
              <RootNavigator.Screen
                name="ReuploadValidationPhoto"
                component={
                  !showOnfidoScreen
                    ? ReuploadValidationPhoto
                    : ReuploadValidationPhotoOnfido
                }
              />
            )}
          </>
        )}
      </RootNavigator.Navigator>
    </>
  );
};

export default RootStack;
