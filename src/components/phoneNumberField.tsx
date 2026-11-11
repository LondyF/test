import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
  View,
} from 'react-native';

type PhoneNumberFieldProps = TextInputProps & {
  prefix?: string;
};

const HIT_SLOP = {bottom: 16, left: 8, right: 24, top: 16};

const PhoneNumberField = forwardRef<RNTextInput, PhoneNumberFieldProps>(
  ({prefix = '', editable, style, accessibilityLabel, ...props}, ref) => {
    const inputRef = useRef<RNTextInput>(null);
    const isEditing = editable !== false;
    const flattenedStyle = StyleSheet.flatten(style);
    const textColor = flattenedStyle?.color ?? 'black';
    const fontSize = flattenedStyle?.fontSize ?? 16;

    useImperativeHandle(ref, () => inputRef.current as RNTextInput);

    const handlePress = () => {
      if (isEditing) {
        inputRef.current?.focus();
      }
    };

    return (
      <Pressable
        accessibilityRole="none"
        hitSlop={HIT_SLOP}
        onPress={handlePress}
        style={[styles.row, style]}>
        <Text
          importantForAccessibility="no"
          pointerEvents="none"
          style={[styles.prefix, {color: textColor, fontSize}]}>
          {prefix}
        </Text>
        <View style={styles.inputWrapper}>
          <RNTextInput
            {...props}
            ref={inputRef}
            editable={isEditing}
            accessibilityLabel={
              accessibilityLabel ? `${accessibilityLabel} ${prefix}` : prefix
            }
            style={[styles.input, {color: textColor, fontSize}]}
          />
        </View>
      </Pressable>
    );
  },
);

PhoneNumberField.displayName = 'PhoneNumberField';

const styles = StyleSheet.create({
  input: {
    fontVariant: ['tabular-nums'],
    height: 24,
    padding: 0,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  prefix: {
    fontVariant: ['tabular-nums'],
    marginRight: 6,
    opacity: 0.6,
    padding: 0,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default PhoneNumberField;
