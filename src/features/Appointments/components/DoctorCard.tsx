import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { faExchange, faUserMd } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { Typography } from '@src/components';
import { Theme } from '@src/styles';

interface DoctorCardProps {
  onSwitchButtonPressed: () => void;
  doctorName: string;
  doctorEstablishment: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  onSwitchButtonPressed,
  doctorEstablishment,
  doctorName,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.doctorIconWrapper}>
        <View style={styles.doctorIconContainer}>
          <FontAwesomeIcon color="white" icon={faUserMd} />
        </View>
      </View>
      <View style={styles.doctorInformationContainer}>
        <Typography fontWeight="bold" variant="b1" color="white" text={doctorName} />
        <Typography
          textStyle={styles.doctorOccupation}
          variant="b1"
          fontStyle="italic"
          fontSize={10}
          fontWeight="600"
          color="white"
          text={doctorEstablishment}
        />
      </View>
      <View style={styles.switchDoctorButtonWrapper}>
        <TouchableOpacity
          onPress={onSwitchButtonPressed}
          style={styles.switchDoctorButtonIconContainer}>
          <FontAwesomeIcon color="white" icon={faExchange} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    padding: 25,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
  },
  doctorIconWrapper: {
    flex: 0.3,
  },
  doctorIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#166CA038',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorInformationContainer: {
    flex: 1,
    alignItems: 'center',
  },
  doctorOccupation: {
    marginTop: -5,
  },
  switchDoctorButtonWrapper: {
    alignItems: 'flex-end',
    flex: 0.3,
  },
  switchDoctorButtonIconContainer: {
    height: 35,
    width: 35,
    backgroundColor: '#166CA038',
    borderRadius: 35 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default DoctorCard;
