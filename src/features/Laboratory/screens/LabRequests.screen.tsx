import React, {useEffect} from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTranslation} from 'react-i18next';
import {NavigationProp, RouteProp} from '@react-navigation/native';

import useTheme from '@hooks/useTheme';

import AllLabResultsScreen from './allLabResults.screen';
import AllLabRequestsScreen from './allLabRequests.screen';

interface Props {
  route: RouteProp<{params: {user: User; mdsId: number}}, 'params'>;
  navigation: NavigationProp<{}>;
}

const Tab = createMaterialTopTabNavigator();

const LabRequestsScreen: React.FC<Props> = ({
  route,
  navigation: {setOptions},
}) => {
  const {t} = useTranslation();
  const {primary, lightGray} = useTheme().colors;

  useEffect(() => {
    if (route.params?.user === undefined) {
      return setOptions({
        title: t('labRequests.myLab'),
      });
    }

    const mandansaUser = route.params.user;

    setOptions({title: `${mandansaUser.naam}'s Lab`});
  }, [route, setOptions, t]);

  return (
    <Tab.Navigator
      lazy={true}
      initialRouteName="AllLabResults"
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
          title: t('labRequests.labRequests'),
        }}
        name="AllLabRequests"
        children={({navigation}) => (
          <AllLabRequestsScreen
            mdsId={route.params?.mdsId}
            navigation={navigation}
          />
        )}
      />
      <Tab.Screen
        options={{
          title: t('labRequests.labResults'),
        }}
        name="AllLabResults"
        children={({navigation}) => (
          <AllLabResultsScreen
            mdsId={route.params?.mdsId}
            navigation={navigation}
          />
        )}
      />
    </Tab.Navigator>
  );
};

export default LabRequestsScreen;
