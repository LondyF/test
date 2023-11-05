import React from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {RouteProp} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import useTheme from '@hooks/useTheme';

import AllMandansasPowerOfAttorneys from './allMandansaPowerOfAttorneys.screen';
import AllMandansAuthorizedReps from './allMandansaAuthorizedReps.screen';

const Tab = createMaterialTopTabNavigator();

interface MandansasScreenProps {
  route: RouteProp<{params: {mdsUser: User; mdsId: number}}, 'params'>;
}

const MandansasScreen: React.FC<MandansasScreenProps> = ({route}) => {
  const {t} = useTranslation();
  const {primary, lightGray} = useTheme().colors;

  const hasToAcceptMandansaRequest =
    route.params !== undefined && !!route.params.mdsUser;

  return (
    <Tab.Navigator
      initialRouteName={
        !hasToAcceptMandansaRequest
          ? 'AllMandansasPowerOfAttorneys'
          : 'AllMandansasAuthorizedReps'
      }
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
          title: t('mandansa.powerOfAttorneys'),
        }}
        name="AllMandansasPowerOfAttorneys"
        component={AllMandansasPowerOfAttorneys}
      />
      <Tab.Screen
        options={{
          title: t('mandansa.authorizedReps'),
        }}
        name="AllMandansasAuthorizedReps">
        {() => (
          <AllMandansAuthorizedReps
            hasToAcceptMandansaRequest={hasToAcceptMandansaRequest}
            {...route?.params}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MandansasScreen;
