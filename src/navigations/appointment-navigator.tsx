import React from 'react';
import {Alert, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  createStackNavigator,
  StackHeaderProps,
} from '@react-navigation/stack';
import {faChevronLeft} from '@fortawesome/pro-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useTranslation} from 'react-i18next';

import AllAppointmentsScreen from '@src/features/Appointments/screens/allAppointments.screen';
import DeclineAppointmentScreen from '@src/features/Appointments/screens/declineAppointment.screen';

import {InfoButton} from '@src/components';
import BookAppointmentScreen from '@src/features/Appointments/screens/bookAppointments.sceen';
import {primaryBlue} from '@src/styles/colors';

const AppointmentNavigator = createStackNavigator();

type AppointmentHeaderProps = StackHeaderProps & {
  backLabel: string;
  onInfoPress: () => void;
};

const AppointmentHeader: React.FC<AppointmentHeaderProps> = ({
  backLabel,
  navigation,
  onInfoPress,
  options,
  route,
}) => {
  const title =
    typeof options.title === 'string' && options.title.length > 0
      ? options.title
      : route.name;

  return (
    <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={backLabel}
          style={[styles.headerButton, styles.headerLeftButton]}
          onPress={() => navigation.goBack()}>
          <FontAwesomeIcon color={primaryBlue} size={26} icon={faChevronLeft} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.headerTitle}>
          {title}
        </Text>
        <InfoButton
          style={[styles.headerButton, styles.headerRightButton]}
          underlayColor="#FFFFFF"
          onPress={onInfoPress}
        />
      </View>
    </SafeAreaView>
  );
};

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
      screenOptions={{
        header: props => (
          <AppointmentHeader
            {...props}
            backLabel={t('common.back')}
            onInfoPress={infoButtonPressed}
          />
        ),
      }}>
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

const styles = StyleSheet.create({
  headerSafeArea: {
    backgroundColor: 'white',
  },
  headerContainer: {
    height: 56,
    alignItems: 'center',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
  },
  headerButton: {
    position: 'absolute',
    top: 6,
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerLeftButton: {
    left: 16,
    alignItems: 'flex-start',
  },
  headerRightButton: {
    right: 16,
    alignItems: 'flex-end',
  },
  headerTitle: {
    color: '#1F1F1F',
    fontSize: 20,
    fontWeight: '700',
    maxWidth: '60%',
  },
});

export default AppointmentStack;
