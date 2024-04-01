import React from 'react';
import {
  TouchableOpacityProps,
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

import useTheme from '@src/hooks/useTheme';
import {Theme} from '@src/styles/styles';
import {colors} from '@src/styles';

export type ButtonProps = TouchableOpacityProps & {
  variant?: 'primary' | 'secondary' | 'transparent' | 'outline';
  text: string;
  onPress: Function;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  customTextComponent?: JSX.Element | null;
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  customTextComponent = null,
  loading = false,
  ...restProps
}) => {
  const appTheme = useTheme();
  const styles = makeStyles(appTheme, loading || restProps.disabled);

  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        {
          ...(variant === 'primary'
            ? styles.primaryButton
            : variant === 'secondary'
            ? styles.secondaryButton
            : variant === 'outline'
            ? styles.outlineButton
            : styles.transparentButton),
        },
        restProps.buttonStyle,
      ]}
      {...restProps}>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <>
          {customTextComponent === null ? (
            <Text
              style={[
                styles.baseText,
                {
                  ...(variant === 'primary'
                    ? styles.primaryText
                    : variant === 'secondary'
                    ? styles.secondaryText
                    : variant === 'outline'
                    ? styles.outlineText
                    : styles.transparentText),
                },
                restProps.textStyle,
              ]}>
              {restProps.text}
            </Text>
          ) : (
            <>{customTextComponent}</>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const makeStyles = (theme: Theme, isDisabled?: boolean) =>
  StyleSheet.create({
    baseButton: {
      borderRadius: 5,
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 12,
      paddingBottom: 12,
      minWidth: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: !isDisabled ? theme.colors.primary : theme.colors.gray,
    },
    secondaryButton: {
      backgroundColor: 'white',
    },
    transparentButton: {
      backgroundColor: 'transparent',
    },
    outlineButton: {
      backgroundColor: 'transparent',
      borderWidth: 2.5,
      borderColor: 'white',
    },
    baseText: {
      fontSize: 12,
      fontWeight: '600',
    },
    transparentText: {
      color: 'white',
    },
    outlineText: {
      color: 'white',
      fontWeight: '700',
    },
    primaryText: {
      color: isDisabled ? theme.colors.darkGray : 'white',
    },
    secondaryText: {
      color: 'darkblue',
    },
  });

export default Button;
