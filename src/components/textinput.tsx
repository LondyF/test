import React from 'react';
import {
  View,
  StyleSheet,
  TextInputProps as ReactNativeTextInputProps,
} from 'react-native';

import {TextField} from 'rn-material-ui-textfield';
import {
  FontAwesomeIcon,
  FontAwesomeIconStyle,
} from '@fortawesome/react-native-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';

type TextInputProps = {
  icon?: IconDefinition;
  iconStyle?: FontAwesomeIconStyle;
  mainColor: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  noMarginTop?: boolean;
} & ReactNativeTextInputProps;

const TextInput: React.FC<TextInputProps> = ({
  icon,
  iconStyle,
  mainColor,
  noMarginTop,
  ...props
}) => {
  const hasIcon = icon != null;

  return (
    <View style={styles.container}>
      <TextField
        disabledLineWidth={2}
        disabledLineType="solid"
        lineType="solid"
        lineWidth={2}
        baseColor={mainColor}
        tintColor={mainColor}
        inputContainerStyle={[hasIcon && styles.inputContainer]}
        textColor={mainColor}
        titleTextStyle={styles.title}
        contextMenuHidden={true}
        containerStyle={{marginTop: noMarginTop ? -10 : undefined}}
        {...props}
      />
      {hasIcon && (
        <FontAwesomeIcon
          style={[
            {color: mainColor},
            styles.iconStyle,
            iconStyle,
            {marginTop: noMarginTop ? -10 : undefined},
          ]}
          size={16}
          icon={icon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  iconStyle: {
    position: 'absolute',
    top: 36,
    left: 0,
  },
  inputContainer: {
    paddingLeft: 30,
  },
  title: {
    fontSize: 13.5,
    marginTop: 5,
  },
});

export default TextInput;
