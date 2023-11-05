import React from 'react';
import { ColorValue, TouchableOpacity, View, StyleSheet } from 'react-native';

import { Typography } from '@components/index';

interface RadioButtonProps {
  labelColor?: ColorValue;
  buttonColor?: ColorValue;
  isSelectedButtonColor?: ColorValue;
  label: String;
  isSelected: boolean;
  onPress: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  onPress,
  labelColor = 'black',
  isSelectedButtonColor = 'white',
  buttonColor = 'black',
  isSelected,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View
        style={[
          styles.buttonBaseBorder,
          { borderColor: !isSelected ? buttonColor : isSelectedButtonColor },
        ]}>
        {isSelected ? (
          <View
            style={[
              styles.buttonBase,
              { backgroundColor: !isSelected ? buttonColor : isSelectedButtonColor },
            ]}
          />
        ) : null}
      </View>
      <Typography
        fontWeight={!isSelected ? 'normal' : 'bold'}
        variant="b1"
        color={labelColor}
        text={label}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBaseBorder: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'white',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  buttonBase: {
    width: 10,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});

export default RadioButton;
