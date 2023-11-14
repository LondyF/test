import React from 'react';
import {Alert, Linking} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {HeaderBackButton} from '@react-navigation/elements';

import {useTranslation} from 'react-i18next';

import AllAppointmentsScreen from '@src/features/Appointments/screens/allAppointments.screen';
import DeclineAppointmentScreen from '@src/features/Appointments/screens/declineAppointment.screen';

import {InfoButton} from '@src/components';
import BookAppointmentScreen from '@src/features/Appointments/screens/bookAppointments.sceen';

const AppointmentNavigator = createStackNavigator();

const AppointmentStack: React.FC = () => {
  const {t} = useTranslation();

  const infoButtonPressed = async () => {
    try {
      const url = t('appointments.helpURL');
      const canOpenURL = await Linking.canOpenURL(url);

      if (canOpenURL) {
        Linking.openURL(url);
      }
    } catch (e) {
      Alert.alert('Oops', 'Failed to open URL');
    }
  };

  return (
    <AppointmentNavigator.Navigator
      screenOptions={({navigation}) => ({
        headerShown: true,
        headerRightContainerStyle: {paddingRight: 25},
        headerLeft: () => (
          <HeaderBackButton onPress={() => navigation.goBack()} />
        ),
        headerRight: () => (
          <InfoButton underlayColor="#FFFFFF" onPress={infoButtonPressed} />
        ),
      })}>
      <AppointmentNavigator.Screen
        name={t('appointments.myAppointments')}
        component={AllAppointmentsScreen}
      />
      <AppointmentNavigator.Screen
        options={{title: t('cancelAppointment.cancelAppointment')}}
        name="declineAppointment"
        component={DeclineAppointmentScreen}
      />
      <AppointmentNavigator.Screen
        options={{title: t('bookAppointment.bookAppointment')}}
        name="bookAppointment"
        component={BookAppointmentScreen}
      />
    </AppointmentNavigator.Navigator>
  );
};

export default AppointmentStack;
