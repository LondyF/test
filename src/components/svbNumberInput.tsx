import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
  View,
} from 'react-native';

type SvbNumberInputProps = TextInputProps & {
  prefix?: string;
};

const HIT_SLOP = {
  bottom: 16,
  left: 24,
  right: 24,
  top: 16,
};

const SvbNumberInput = forwardRef<RNTextInput, SvbNumberInputProps>(
  (
    {
      prefix = '',
      value,
      editable,
      style,
      onChangeText,
      onFocus,
      onBlur,
      accessibilityLabel,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<RNTextInput>(null);
    const isEditing = editable !== false;
    const textColor = StyleSheet.flatten(style)?.color ?? 'black';

    useImperativeHandle(ref, () => inputRef.current as RNTextInput);

    const handlePress = () => {
      if (!isEditing) {
        return;
      }
      inputRef.current?.focus();
    };

    return (
      <Pressable
        accessibilityRole="none"
        hitSlop={HIT_SLOP}
        onPress={handlePress}
        style={[styles.row, style]}>
        <Text
          style={[
            styles.digits,
            {color: textColor},
            isEditing && styles.lockedPrefix,
          ]}
          importantForAccessibility="no"
          pointerEvents="none">
          {prefix}
        </Text>
        <Text
          style={[
            styles.digits,
            styles.hyphen,
            {color: textColor},
            isEditing && styles.lockedPrefix,
          ]}
          importantForAccessibility="no"
          pointerEvents="none">
          -
        </Text>
        <View style={styles.hitTarget} pointerEvents="box-none">
          <RNTextInput
            {...props}
            ref={inputRef}
            value={value}
            editable={isEditing}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            accessibilityLabel={accessibilityLabel}
            accessibilityHint="Enter one digit. The first eight digits cannot be changed."
            style={[styles.digit, {color: textColor}]}
          />
        </View>
      </Pressable>
    );
  },
);

SvbNumberInput.displayName = 'SvbNumberInput';

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  digits: {
    fontSize: 16,
    fontVariant: ['tabular-nums'],
    padding: 0,
  },
  lockedPrefix: {
    opacity: 0.6,
  },
  hyphen: {
    marginHorizontal: 4,
  },
  hitTarget: {
    alignItems: 'flex-start',
    height: 24,
    justifyContent: 'center',
    minWidth: 44,
  },
  digit: {
    fontSize: 16,
    fontVariant: ['tabular-nums'],
    height: 24,
    minWidth: 44,
    padding: 0,
    textAlign: 'left',
  },
});

export default SvbNumberInput;
