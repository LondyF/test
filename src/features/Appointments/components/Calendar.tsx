import React, {useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';

import {
  CalendarList,
  CalendarListProps as CalProps,
} from 'react-native-calendars';

import {Theme} from '@src/styles';

import CalendarDay from './CalendarDay';

interface CalendarProps extends CalProps {
  markedDays: Array<string>;
  selectedDate: string;
  onAvailabeDayPress: (date: string) => void;
}
interface CalendarDayComponentProps {
  date: {
    dateString: string;
    day: number;
    month: number;
    timestamp: number;
  };
  year: number;
  state: string;
}

const Calendar: React.FC<CalendarProps> = ({
  markedDays,
  onAvailabeDayPress,
  selectedDate,
  ...restProps
}) => {
  const {width} = useWindowDimensions();

  const onDayPress = (date: string) => {
    onAvailabeDayPress(date);
  };

  return (
    <View style={styles.calendarWrapper}>
      <CalendarList
        {...restProps}
        horizontal
        markedDates={{
          [selectedDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: '#5E60CE',
            selectedTextColor: 'white',
          },
        }}
        pagingEnabled
        firstDay={1}
        dayComponent={(props: CalendarDayComponentProps) => {
          return (
            <CalendarDay
              onDayPress={onDayPress}
              markedDays={markedDays}
              {...props}
            />
          );
        }}
        theme={{
          textDayHeaderFontWeight: '600',
          textSectionTitleColor: Theme.colors.primary,
          textDayFontWeight: '600',
        }}
        hideArrows={false}
        hideExtraDays={true}
        style={{...styles.calendar, ...{width}}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarWrapper: {
    height: 350,
  },
  scrollViewContent: {
    paddingVertical: 15,
  },
  calendar: {
    width: 375,
    alignSelf: 'center',
    overflow: 'hidden',
  },
});

export default React.memo(Calendar);
