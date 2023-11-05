import React from 'react';
import {View, StyleSheet} from 'react-native';

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
};

const TextInput: React.FC<TextInputProps> = ({
  icon,
  iconStyle,
  mainColor,
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
        inputContainerStyle={hasIcon && styles.inputContainer}
        textColor={mainColor}
        titleTextStyle={styles.title}
        contextMenuHidden={true}
        {...props}
      />
      {hasIcon && (
        <FontAwesomeIcon
          style={[{color: mainColor}, styles.iconStyle, iconStyle]}
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
