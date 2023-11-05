import React from 'react';
import {StyleSheet} from 'react-native';

import {HeaderBackButton} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {createDrawerNavigator} from '@react-navigation/drawer';

import DoctorReferrals from '@src/features/Referrals/screens/doctorReferrals';
import HealthCheckUpScreen from '@src/features/HealthCheck/screens/HealthCheckUp.screen';
import MyMedications from '@src/features/Medication/screens/myMedications.screen';
import useTheme from '@hooks/useTheme';
import useAuthStore from '@stores/useAuthStore';
import {Drawer} from '@src/components';

import DeclarationStack from './declaration-navigator';
import AppointmentStack from './appointment-navigator';
import AppStackNavigator from './stack-navigator';

const DrawerNavigator = createDrawerNavigator();

const AppStack = () => {
  const theme = useTheme();
  const [user, logoutUser] = useAuthStore(state => [
    state.user,
    state.resetAuthentication,
  ]);

  const {t} = useTranslation();

  return (
    <DrawerNavigator.Navigator
      drawerStyle={styles.drawer}
      screenOptions={({navigation}) => ({
        headerLeft: () => (
          <HeaderBackButton onPress={() => navigation.goBack()} />
        ),
      })}
      drawerContent={props => (
        <Drawer
          props={props}
          theme={theme}
          user={user!}
          logoutUser={logoutUser}
        />
      )}
      initialRouteName="Login">
      <DrawerNavigator.Screen name="Home" component={AppStackNavigator} />
      <DrawerNavigator.Screen
        options={{
          headerShown: false,
          drawerLabel: t('dashboard.myAppointments'),
        }}
        name="AllAppointments"
        component={AppointmentStack}
      />
      <DrawerNavigator.Screen
        name="AllReferrals"
        component={DoctorReferrals}
        options={{
          headerShown: true,
          drawerLabel: t('dashboard.myDoctorReferrals'),
          unmountOnBlur: true,
        }}
      />
      {user?.showDeclarations === 1 && (
        <DrawerNavigator.Screen
          options={{
            headerShown: false,
            drawerLabel: t('dashboard.myDeclarations'),
          }}
          name="AllDeclarations"
          component={DeclarationStack}
        />
      )}
      <DrawerNavigator.Screen
        options={{
          headerShown: true,
          drawerLabel: t('dashboard.myMedication'),
        }}
        name="AllMedications"
        component={MyMedications}
      />
      <DrawerNavigator.Screen
        options={{
          headerShown: true,
          drawerLabel: t('dashboard.healthCheckUp'),
        }}
        name="HealthCheckUp"
        component={HealthCheckUpScreen}
      />
    </DrawerNavigator.Navigator>
  );
};

const styles = StyleSheet.create({
  drawer: {
    width: 300,
    padding: 0,
  },
});

export default AppStack;
