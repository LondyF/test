import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface RadioButtonGroupProps {
  containerStyle?: ViewStyle;
  optionContainerStyle?: ViewStyle;
  options: string[];
  selectedOptionIndex: number;
  renderOption: (option: string, isSelected: boolean, index: number) => JSX.Element;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  containerStyle,
  optionContainerStyle,
  options,
  renderOption,
  selectedOptionIndex,
}) => {
  return (
    <View style={[styles.baseContainer, containerStyle]}>
      {options.map((item, index) => (
        <View key={index} style={optionContainerStyle}>
          {renderOption(item, index === selectedOptionIndex, index)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    alignItems: 'flex-start',
  },
});

export default RadioButtonGroup;
