import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Typography } from '@src/components';
import { Theme as primaryTheme } from '@src/styles';
import { Theme } from '@src/styles/styles';

type CalendarDayDate = {
  dateString: string;
  day: number;
  month: number;
  timestamp: number;
};

interface CalendarDayProps {
  date: CalendarDayDate;
  year: number;
  state: string;
  markedDays: string[];
  onDayPress: (date: string) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date: { dateString, day },
  markedDays,
  onDayPress,
  ...props
}) => {
  const isAvailableDate = markedDays.includes(dateString);
  const styles = makeStyles(primaryTheme);
  const isSelected = props.marking?.selected;

  return (
    <TouchableOpacity
      onPress={() => onDayPress(dateString)}
      disabled={!isAvailableDate}
      style={{
        ...styles.baseContainer,
        ...(isSelected && styles.selectedDayContainer),
      }}>
      <Typography
        fontWeight="500"
        textStyle={{
          ...styles.dayText,
          ...(isAvailableDate && styles.availableDateText),
          ...(isSelected && styles.selectedDayText),
        }}
        variant="b1"
        text={String(day)}
      />
    </TouchableOpacity>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    baseContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 32,
      height: 32,
    },
    selectedDayContainer: {
      borderRadius: 32 / 2,
      backgroundColor: theme.colors.primary,
    },
    dayText: {
      color: theme.colors.gray,
    },
    availableDateText: {
      color: 'black',
      fontWeight: 'bold',
    },
    selectedDayText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });

export default CalendarDay;
