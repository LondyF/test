import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import IdentifyScreen from '@src/features/Identify/screens/identify.screen';
import LabResult from '@src/features/Laboratory/screens/labResult.screen';
import LabRequestsScreen from '@src/features/Laboratory/screens/LabRequests.screen';
import HomeAppointment from '@src/features/Laboratory/screens/homeAppointment.screen';

const LabRequestNavigator = createStackNavigator();

const LabRequestStack: React.FC = () => {
  const {t} = useTranslation();

  return (
    <LabRequestNavigator.Navigator screenOptions={{headerShown: true}}>
      <LabRequestNavigator.Screen
        name="LabRequests"
        component={LabRequestsScreen}
      />
      <LabRequestNavigator.Screen name="LabResult" component={LabResult} />
      <LabRequestNavigator.Screen
        options={{title: t('labRequests.createHomeAppointment')}}
        name="HomeAppointment"
        component={HomeAppointment}
      />
      <LabRequestNavigator.Screen
        name="Identify"
        options={{title: t('dashboard.identify')}}
        component={IdentifyScreen}
      />
    </LabRequestNavigator.Navigator>
  );
};
export default LabRequestStack;
