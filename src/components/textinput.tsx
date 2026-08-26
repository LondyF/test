import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Text,
  TextInput as NativeTextInput,
  View,
  StyleSheet,
  TextInputProps as ReactNativeTextInputProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import {
  FontAwesomeIcon,
  FontAwesomeIconStyle,
} from '@fortawesome/react-native-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';

type TextInputProps = {
  InputComponent?: React.ComponentType<ReactNativeTextInputProps>;
  icon?: IconDefinition;
  iconStyle?: FontAwesomeIconStyle;
  mainColor: string;
  label?: string;
  error?: string;
  title?: string;
  errorColor?: string;
  textColor?: string;
  baseColor?: string;
  tintColor?: string;
  disabled?: boolean;
  noMarginTop?: boolean;
  labelFontSize?: number;
  fontSize?: number;
  lineWidth?: number;
  activeLineWidth?: number;
  disabledLineWidth?: number;
  lineType?: 'solid' | 'dotted' | 'dashed';
  disabledLineType?: 'solid' | 'dotted' | 'dashed';
  labelTextStyle?: StyleProp<TextStyle>;
  titleTextStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  animationDuration?: number;
} & ReactNativeTextInputProps;

const TextInput: React.FC<TextInputProps> = ({
  icon,
  iconStyle,
  mainColor,
  noMarginTop,
  errorColor = '#D32F2F',
  textColor,
  baseColor,
  tintColor,
  labelFontSize = 12,
  fontSize = 16,
  lineWidth = 2,
  activeLineWidth = lineWidth,
  disabledLineWidth = 2,
  lineType,
  disabledLineType,
  labelTextStyle,
  titleTextStyle,
  containerStyle,
  inputContainerStyle,
  animationDuration = 225,
  InputComponent = NativeTextInput,
  ...props
}) => {
  const hasIcon = icon != null;
  const {
    error,
    label,
    disabled,
    title,
    style,
    value,
    defaultValue,
    editable,
    onFocus,
    onBlur,
    onChangeText,
    placeholder,
    multiline,
    ...textInputProps
  } = props;
  const hasLabel = label != null && label !== '';
  const [inputValue, setInputValue] = useState(value ?? defaultValue ?? '');
  const [isFocused, setIsFocused] = useState(false);
  const hasText = String(inputValue).length > 0;
  const labelAnimation = useRef(
    new Animated.Value(hasText ? 1 : 0),
  ).current;
  const isEditable = editable !== false && !disabled;
  const inputColor = textColor || mainColor;
  const fieldColor = error
    ? errorColor
    : isFocused
      ? tintColor || mainColor
      : baseColor || mainColor;
  const underlineWidth = !isEditable
    ? disabledLineWidth
    : isFocused
      ? activeLineWidth
      : lineWidth;
  const underlineStyle = !isEditable ? disabledLineType : lineType;
  const shouldFloatLabel = isFocused || hasText;
  const underlineDynamicStyle: ViewStyle = underlineStyle
    ? {
        borderBottomColor: fieldColor,
        borderBottomWidth: underlineWidth,
        borderStyle: underlineStyle,
      }
    : {
        backgroundColor: fieldColor,
        height: underlineWidth,
      };

  useEffect(() => {
    if (value != null) {
      setInputValue(value);
    }
  }, [value]);

  useEffect(() => {
    Animated.timing(labelAnimation, {
      toValue: shouldFloatLabel ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  }, [animationDuration, labelAnimation, shouldFloatLabel]);

  const handleFocus: NonNullable<ReactNativeTextInputProps['onFocus']> = event => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: NonNullable<ReactNativeTextInputProps['onBlur']> = event => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleChangeText: NonNullable<
    ReactNativeTextInputProps['onChangeText']
  > = text => {
    setInputValue(text);
    onChangeText?.(text);
  };

  const animatedLabelStyle = {
    color: fieldColor,
    fontSize: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, labelFontSize],
    }),
    left: hasIcon ? 30 : 0,
    top: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [multiline ? 24 : 25, 4],
    }),
  };

  return (
    <View
      style={[
        styles.container,
        {marginTop: noMarginTop ? -10 : undefined},
        containerStyle,
      ]}>
      <View style={[styles.inputContainer, inputContainerStyle]}>
        {hasIcon && (
          <FontAwesomeIcon
            color={fieldColor}
            style={[{color: fieldColor}, styles.iconStyle, iconStyle]}
            size={16}
            icon={icon}
          />
        )}
        {hasLabel && (
          <Animated.Text
            pointerEvents="none"
            style={[styles.label, animatedLabelStyle, labelTextStyle]}>
            {label}
          </Animated.Text>
        )}
        <InputComponent
          accessibilityLabel={label || placeholder}
          contextMenuHidden={true}
          editable={isEditable}
          placeholder={hasLabel ? undefined : placeholder}
          placeholderTextColor={mainColor}
          value={value}
          defaultValue={defaultValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          multiline={multiline}
          style={[
            styles.input,
            {fontSize},
            hasLabel && styles.inputWithLabel,
            multiline && styles.multilineInput,
            {color: inputColor},
            hasIcon && styles.inputWithIcon,
            !isEditable && styles.disabledInput,
            style,
          ]}
          {...textInputProps}
        />
        <View
          style={[
            styles.underline,
            underlineDynamicStyle,
            !isEditable && styles.disabledUnderline,
          ]}
        />
      </View>
      {(error || title) && (
        <Text
          style={[
            styles.error,
            {color: error ? errorColor : fieldColor},
            titleTextStyle,
          ]}>
          {error || title}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  disabledInput: {
    opacity: 0.6,
  },
  disabledUnderline: {
    opacity: 0.6,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  iconStyle: {
    bottom: 13,
    position: 'absolute',
    left: 0,
  },
  input: {
    minHeight: 48,
    paddingBottom: 0,
    paddingHorizontal: 0,
    paddingTop: 24,
  },
  inputContainer: {
    height: 58,
    minHeight: 58,
    position: 'relative',
  },
  inputWithIcon: {
    paddingLeft: 30,
  },
  inputWithLabel: {
    paddingTop: 24,
  },
  label: {
    position: 'absolute',
  },
  multilineInput: {
    minHeight: 82,
    textAlignVertical: 'top',
  },
  underline: {
    bottom: 0,
    height: 2,
    left: 0,
    position: 'absolute',
    width: '100%',
  },
});

export default TextInput;
