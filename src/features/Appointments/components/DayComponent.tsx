import React from 'react';
import { View, StyleSheet } from 'react-native';

import { IDayComponentProps } from 'react-native-calendar-strip';
import { Moment } from 'moment';

import { Typography } from '@src/components';

type Props = IDayComponentProps;
type Day = moment.Duration & Moment;

const DayComponent: React.FC<Props> = (props) => {
  return (
    <View style={styles.dateContainer}>
      <View style={styles.dayContainer}>
        <Typography
          variant="b1"
          fontSize={8}
          text={(props.date as Day).format('ddd').toUpperCase()}
        />
        <Typography variant="b1" fontWeight="bold" text={(props.date as Day).date().toString()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    flex: 1,
  },
  dayContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default React.memo(DayComponent);
