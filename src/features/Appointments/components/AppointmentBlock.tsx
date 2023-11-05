import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {Typography} from '@src/components';
import useTheme from '@src/hooks/useTheme';
import {Theme} from '@src/styles/styles';
import {Appointment} from '../types/appointments';
import useAppointmentStatus from '../hooks/useAppointmentStatus';

const AppointmentBlock: React.FC<{
  status: number;
  appointment: Appointment;
  date: Date;
  onPress: () => void;
}> = ({
  status,
  appointment: {subject, lokatie, docter, statusTxt},
  date,
  onPress,
}) => {
  const appTheme = useTheme();
  const styles = makeStyles(appTheme);
  const {fontColor, background} = useAppointmentStatus(status);

  const getTime = () => {
    let dateString = date.toString().split('T')[1];
    return dateString.substring(0, dateString.length - 3);
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.appointmentBlockContainer}>
        <View style={styles.timeContainer}>
          <Typography variant="b1" fontWeight="bold" text={getTime()} />
        </View>
        <View style={styles.verticalLine} />
        <View
          style={[
            styles.appointmentBlock,
            {backgroundColor: background, borderTopColor: fontColor},
          ]}>
          <View style={styles.doctorAndSubjectContainer}>
            <Typography variant="b1" fontWeight="bold" text={docter[0].naam} />
            <Typography
              textStyle={styles.dash}
              variant="b1"
              fontWeight="bold"
              text="-"
            />
            <Typography variant="b1" text={subject} />
          </View>
          <Typography
            textStyle={styles.locationText}
            variant="b1"
            text={lokatie}
          />
          <Typography
            textStyle={styles.statusText}
            color={fontColor}
            fontWeight="bold"
            variant="b1"
            text={statusTxt}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    verticalLine: {
      width: 1.5,
      height: '100%',
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.lightGray,
    },
    appointmentBlock: {
      backgroundColor: '#ffe5ec',
      borderTopColor: 'red',
      borderTopWidth: 2,
      paddingVertical: 20,
      paddingHorizontal: 10,
      flex: 1,
    },
    appointmentBlockContainer: {
      flexDirection: 'row',
      minHeight: 80,
    },
    timeContainer: {
      paddingTop: 5,
      width: 50,
    },
    statusText: {
      marginTop: 4,
      fontSize: 12,
    },
    locationText: {
      marginTop: 4,
      fontSize: 12,
    },
    dash: {
      marginHorizontal: 8,
    },
    doctorAndSubjectContainer: {
      flexDirection: 'row',
    },
  });

export default AppointmentBlock;
