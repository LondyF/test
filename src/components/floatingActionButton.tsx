import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ColorValue,
  View,
} from 'react-native';

import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { Theme } from '@src/styles';

interface FloatingActionButtonProps extends TouchableOpacityProps {
  icon: IconDefinition;
  onPress: () => void;
  buttonColor?: ColorValue;
  iconColor?: ColorValue;
  iconSize?: number;
  iconOffsetX?: number;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onPress,
  iconColor = 'white',
  buttonColor = Theme.colors.primary,
  iconSize = 20,
  iconOffsetX = 0,
  style,
  ...props
}) => {
  const styles = makeStyles(buttonColor, props, iconOffsetX);

  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      style={[styles.baseButtonStyle, style]}>
      <View style={styles.iconWrapper}>
        <FontAwesomeIcon
          color={iconColor.toString()}
          size={iconSize}
          icon={icon}
        />
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (
  buttonColor: ColorValue,
  props: TouchableOpacityProps,
  iconOffsetX: number,
) =>
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
    iconWrapper: {
      transform: [{translateX: iconOffsetX}],
    },
  });

export default FloatingActionButton;
