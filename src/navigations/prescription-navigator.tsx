import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import IdentifyScreen from '@src/features/Identify/screens/identify.screen';
import AllPrescriptionsScreen from '@src/features/Prescription/screens/allPrescriptions.screen';

const PrescriptionNavigator = createStackNavigator();

const PrescriptionStack: React.FC = () => {
  const {t} = useTranslation();

  return (
    <PrescriptionNavigator.Navigator>
      <PrescriptionNavigator.Screen
        name="AllPrescriptions"
        component={AllPrescriptionsScreen}
      />
      <PrescriptionNavigator.Screen
        name="Identify"
        options={{title: t('dashboard.identify')}}
        component={IdentifyScreen}
      />
    </PrescriptionNavigator.Navigator>
  );
};

export default PrescriptionStack;
