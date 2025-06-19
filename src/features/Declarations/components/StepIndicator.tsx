import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import {Theme} from '@src/styles/styles';
import useTheme from '@src/hooks/useTheme';

const StepIndicator = ({
  currentStep = 0,
  style,
}: {
  currentStep: number;
  style: ViewStyle;
}) => {
  const steps = ['Sent', 'Pending Info', 'Approved', 'Refund'];

  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => {
        const isActive = index === currentStep - 1;

        return (
          <TouchableOpacity key={step} style={styles.stepContainer}>
            <View
              style={[
                styles.underline,
                isActive ? styles.activeLine : styles.inactiveLine,
              ]}
            />
            <Text
              style={[
                styles.label,
                isActive ? styles.activeText : styles.inactiveText,
              ]}>
              {step}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default StepIndicator;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 16,
      paddingBottom: 14,
      backgroundColor: 'white',
      gap: 20,
    },
    stepContainer: {
      alignItems: 'center',
      flex: 1,
    },
    underline: {
      width: '100%',
      height: 4,
      marginBottom: 4,
      borderRadius: 1.5,
    },
    activeLine: {
      backgroundColor: theme.colors.primary,
    },
    inactiveLine: {
      backgroundColor: '#D3D3D3', // Light gray
    },
    label: {
      fontSize: 12,
      fontWeight: '500',
      textAlign: 'center',
    },
    activeText: {
      color: theme.colors.primary,
    },
    inactiveText: {
      color: '#C0C0C0',
    },
  });
