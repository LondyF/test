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
import {DeclarationStatus} from '../types/declarations';

const StepIndicator = ({
  currentStep = DeclarationStatus.DRAFT,
  style,
}: {
  currentStep: DeclarationStatus;
  style: ViewStyle;
}) => {
  const steps = ['Sent', 'Pending Info', 'Approved', 'Refund'];

  const theme = useTheme();
  const styles = createStyles(theme);

  const getActiveStep = () => {
    switch (currentStep) {
      case DeclarationStatus.SUBMITTED:
        return 0; // Sent
      case DeclarationStatus.ACTION_REQUIRED:
        return 1; // Pending Info
      case DeclarationStatus.COMPLETED:
        return 2; // Approved
      case DeclarationStatus.IN_PROGRESS:
        return 3; // Refund
      default:
        return 0; // Default to Sent
    }
  };

  const activeStepIndex = getActiveStep();

  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => {
        const isActive = index === activeStepIndex;

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
