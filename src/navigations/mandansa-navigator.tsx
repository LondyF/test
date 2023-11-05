import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import AllMandansas from '@src/features/Mandansa/screens/mandansas.screen';
import RegisterMandansaScreen from '@src/features/Mandansa/screens/registerMandansa.screen';
import IdentifyScreen from '@src/features/Identify/screens/identify.screen';
import ReuploadValidationPhoto from '@src/features/Auth/screens/reuploadValidationPhoto.screen';

const MandansaNavigator = createStackNavigator();

const MandansaStack: React.FC = () => {
  const {t} = useTranslation();

  return (
    <MandansaNavigator.Navigator
      screenOptions={{headerShown: true, title: t('dashboard.mandansa')}}>
      <MandansaNavigator.Screen name="AllMandansa" component={AllMandansas} />
      <MandansaNavigator.Screen
        name="RegisterMandansa"
        component={RegisterMandansaScreen}
      />
      <MandansaNavigator.Screen name="Identify" component={IdentifyScreen} />
      <MandansaNavigator.Screen
        options={{headerShown: false}}
        name="ReuploadValidationPhoto"
        component={ReuploadValidationPhoto}
      />
    </MandansaNavigator.Navigator>
  );
};

export default MandansaStack;
