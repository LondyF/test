import React from 'react';
import {View, ViewStyle} from 'react-native';

import StepIndicator from 'react-native-step-indicator';

import {Steps} from '../screens/register.screen';

interface ProgressTrackerProps {
  steps: {step: Steps; title: string}[];
  currentStep: number;
  containerStyle?: ViewStyle;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  steps,
  containerStyle,
  currentStep = 0,
}) => {
  const stepLabels = steps.map(x => x.title);

  return (
    <View style={containerStyle}>
      <StepIndicator
        customStyles={styles}
        stepCount={steps.length}
        labels={stepLabels}
        currentPosition={currentStep}
      />
    </View>
  );
};

const styles = {
  labelColor: 'white',
  currentStepLabelColor: 'white',
  stepIndicatorSize: 20,
  currentStepIndicatorSize: 30,
  stepStrokeCurrentColor: 'white',
  labelSize: 10,
  stepIndicatorLabelFontSize: 12.5,
  separatorFinishedColor: 'white',
  separatorUnFinishedColor: 'darkgray',
  stepIndicatorFinishedColor: 'white',
  stepIndicatorLabelFinishedColor: '#333333',
  stepIndicatorUnFinishedColor: 'darkgray',
  stepIndicatorCurrentColor: 'white',
};

export default ProgressTracker;
