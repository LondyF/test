import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';

import AllPharmaciesScreen from '@src/features/Pharmacy/screens/allPharmacies.screen';
import AllLaboratoriesScreen from '@src/features/Laboratory/screens/allLaboratories.screen';
import TransactionResultScreen from '@src/features/Identify/screens/transactionResult.screen';
import ChangePasswordScreen from '@src/features/Auth/screens/changePassword.screen';
import AllNotifications from '@src/features/Notifications/screens/allNotifications.screen';

import {PinView} from '@src/components';

import TabNavigator from './tab-navigator';
import MandansaStack from './mandansa-navigator';
import PrescriptionStack from './prescription-navigator';
import LabRequestsStack from './labRequest-navigator';
import MapScreen from '@src/features/Map/screens/map.screen';

const StackNavigator = createStackNavigator();
const AppStackNavigator = () => {
  const {t} = useTranslation();

  return (
    <StackNavigator.Navigator
      screenOptions={{gestureEnabled: false, headerShown: false}}>
      <StackNavigator.Screen name="Home" component={TabNavigator} />
      <StackNavigator.Screen
        name="AllPharmacies"
        options={{headerShown: true, title: t('dashboard.pharmacies')}}
        component={AllPharmaciesScreen}
      />
      <StackNavigator.Screen
        options={{headerShown: true, title: t('dashboard.prickPost')}}
        name="AllLabs"
        component={AllLaboratoriesScreen}
      />
      <StackNavigator.Screen name="AllMandansas" component={MandansaStack} />
      <StackNavigator.Screen
        name="Prescriptions"
        component={PrescriptionStack}
      />
      <StackNavigator.Screen name="LabRequests" component={LabRequestsStack} />
      <StackNavigator.Screen
        name="Notifications"
        component={AllNotifications}
      />
      <StackNavigator.Screen
        name="TransactionResult"
        component={TransactionResultScreen}
      />
      <StackNavigator.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />
      <StackNavigator.Screen name="Pin" component={PinView} />
      <StackNavigator.Screen
        options={{headerShown: true}}
        name="Map"
        component={MapScreen}
      />
    </StackNavigator.Navigator>
  );
};

export default AppStackNavigator;
