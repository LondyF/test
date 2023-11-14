import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/elements';
import {useTranslation} from 'react-i18next';

import DeclarationGallery from '@src/features/Declarations/screens/DeclarationGallery.screen';
import NewDeclarationScreen from '@src/features/Declarations/screens/NewDeclaration.screen';
import MyDeclarations from '@src/features/Declarations/screens/myDeclarations.screen';

const DeclarationNavigator = createStackNavigator();

const DeclarationStack: React.FC = () => {
  const {t} = useTranslation();
  return (
    <DeclarationNavigator.Navigator
      screenOptions={({navigation}) => ({
        headerShown: true,
        headerLeft: () => (
          <HeaderBackButton onPress={() => navigation.goBack()} />
        ),
      })}>
      <DeclarationNavigator.Screen
        name="MyDeclarations"
        options={{title: t('common.myDeclarations')}}
        component={MyDeclarations}
      />
      <DeclarationNavigator.Screen
        name="DeclarationGallery"
        component={DeclarationGallery}
      />
      <DeclarationNavigator.Screen
        name="NewDeclaration"
        component={NewDeclarationScreen}
      />
    </DeclarationNavigator.Navigator>
  );
};

export default DeclarationStack;
