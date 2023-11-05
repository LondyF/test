import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ColorValue } from 'react-native';

import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { Theme } from '@src/styles';

interface FloatingActionButtonProps extends TouchableOpacityProps {
  icon: IconDefinition;
  onPress: () => void;
  buttonColor?: ColorValue;
  iconColor?: ColorValue;
  iconSize?: number;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onPress,
  iconColor = 'white',
  buttonColor = Theme.colors.primary,
  ...props
}) => {
  const styles = makeStyles(buttonColor, props);

  return (
    <TouchableOpacity {...props} onPress={onPress} style={[styles.baseButtonStyle]}>
      <FontAwesomeIcon color={iconColor.toString()} size={20} icon={icon} />
    </TouchableOpacity>
  );
};

const makeStyles = (buttonColor: ColorValue, props: TouchableOpacityProps) =>
  StyleSheet.create({
    baseButtonStyle: {
      position: 'absolute',
      backgroundColor: props.disabled ? 'gray' : buttonColor,
      width: 60,
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 20,
      right: 20,
      height: 60,
      borderRadius: 30,
      elevation: 1,
    },
  });

export default FloatingActionButton;
