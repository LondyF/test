import React, {useCallback} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTranslation} from 'react-i18next';

import {
  faUser,
  faQrcode,
  faHomeAlt,
  faKey,
} from '@fortawesome/pro-solid-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeIconStyle,
} from '@fortawesome/react-native-fontawesome';
import {EventArg} from '@react-navigation/core';

import IdentifyScreen from '@src/features/Identify/screens/identify.screen';
import UserProfileScreen from '@src/features/UserProfile/screens/userProfile.screen';
import DashboardScreen from '@src/features/Dashboard/screens/dashboard.screen';
import QRScannerAuthenticatorScreen from '@src/features/UserProfile/screens/qrScannerAuthenticator.screen';
import useTheme from '@hooks/useTheme';
import useBiometrics from '@hooks/useBiometrics';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const Theme = useTheme();
  const {t} = useTranslation();
  const {promptBiometrics} = useBiometrics();

  const iconStyle: FontAwesomeIconStyle = {
    marginTop: 10,
    alignSelf: 'center',
  };

  const handleQRScannerTabListener = useCallback(
    ({navigation}) => ({
      tabPress: async (e: EventArg<'tabPress', true>) => {
        e.preventDefault();

        const {routes, index} = navigation.dangerouslyGetState();
        const currentSelectedTab = routes[index].name;

        if (await promptBiometrics(true)) {
          navigation.navigate('QRScannerAuthenticator', {currentSelectedTab});
        }
      },
    }),
    [promptBiometrics],
  );

  return (
    <Tab.Navigator
      tabBarOptions={{activeTintColor: Theme.colors.primary}}
      screenOptions={({route: {name}}) => ({
        tabBarIcon: ({color}) => {
          return (
            <FontAwesomeIcon
              color={color}
              icon={
                name === 'Home'
                  ? faHomeAlt
                  : name === 'Identify'
                  ? faQrcode
                  : name === 'QRScannerAuthenticator'
                  ? faKey
                  : faUser
              }
              size={18}
              style={iconStyle}
            />
          );
        },
      })}
      initialRouteName="Dashboard">
      <Tab.Screen
        name="Home"
        options={{tabBarLabel: t('tabs.home')}}
        component={DashboardScreen}
      />
      <Tab.Screen
        name="Identify"
        options={{tabBarLabel: t('tabs.identify')}}
        component={IdentifyScreen}
      />
      <Tab.Screen
        name="Profile"
        options={{tabBarLabel: t('tabs.me')}}
        component={UserProfileScreen}
      />
      <Tab.Screen
        name="QRScannerAuthenticator"
        listeners={handleQRScannerTabListener}
        options={{unmountOnBlur: true, tabBarLabel: 'Authenticate'}}
        component={QRScannerAuthenticatorScreen}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
