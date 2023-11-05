import React, {useEffect} from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTranslation} from 'react-i18next';
import {NavigationProp, RouteProp} from '@react-navigation/native';

import useTheme from '@hooks/useTheme';

import AllDoctorReferrals from './allDoctorReferrals';
import AllMachtigingen from './allMachtigingen';

const Tab = createMaterialTopTabNavigator();

interface Props {
  route: RouteProp<{params: {user: User; mdsId: number}}, 'params'>;
  navigation: NavigationProp<{}>;
}

const DoctorReferrals: React.FC<Props> = ({route, navigation}) => {
  const {t} = useTranslation();

  const {
    colors: {primary, lightGray},
  } = useTheme();

  useEffect(() => {
    if (route.params?.user === undefined) {
      return navigation.setOptions({
        title: t('doctorReferrals.myDoctorReferrals'),
      });
    }

    const mandansaUser = route.params.user;

    navigation.setOptions({
      title: `${mandansaUser.naam}'s ${t('doctorReferrals.doctorReferrals')}`,
    });
  }, [navigation, route, t]);

  useEffect(() => {
    return () => {
      navigation.setParams({user: undefined, mdsId: undefined});
    };
  }, [navigation]);

  return (
    <Tab.Navigator
      lazy={true}
      tabBarOptions={{
        labelStyle: {
          textTransform: 'capitalize',
          fontWeight: 'bold',
        },
        indicatorStyle: {
          backgroundColor: primary,
        },
        activeTintColor: primary,
        inactiveTintColor: lightGray,
      }}>
      <Tab.Screen
        options={{
          title: t('doctorReferrals.doctorReferrals'),
        }}
        name="AllDoctorReferrals"
        children={() => <AllDoctorReferrals mdsId={route.params?.mdsId} />}
      />
      <Tab.Screen
        options={{
          title: t('doctorReferrals.machtigingen'),
        }}
        name="AllMachtigingen"
        children={() => <AllMachtigingen mdsId={route.params?.mdsId} />}
      />
    </Tab.Navigator>
  );
};

export default DoctorReferrals;
