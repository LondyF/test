import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeIconStyle } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { StyleSheet, Text, View, TextStyle, ViewStyle } from 'react-native';
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';

interface SelectInputProps extends PickerSelectProps {
  labelStyle?: TextStyle;
  icon?: IconDefinition;
  iconStyle?: FontAwesomeIconStyle;
  bottomBorderStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  inputIOSStyle?: TextStyle;
  inputAndroidStyle?: TextStyle;
  onValueChange: (value: any, index: number) => void;
  itemKey?: string | number;
  value?: any;
  label: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  labelStyle,
  icon,
  iconStyle,
  bottomBorderStyle,
  containerStyle,
  inputAndroidStyle,
  inputIOSStyle,
  itemKey,
  value,
  label,
  onValueChange,
  ...props
}) => {
  const styles = makeStyles(icon !== undefined);
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.labelStyle, labelStyle]}>{label}</Text>
      <View style={styles.inputIconWrapper}>
        {icon && <FontAwesomeIcon style={[styles.iconStyle, iconStyle]} size={16} icon={icon} />}
        <View style={styles.flex}>
          <RNPickerSelect
            {...props}
            value={value}
            itemKey={itemKey}
            useNativeAndroidPickerStyle={false}
            placeholder={{}}
            style={{
              inputAndroid: { padding: 0, fontSize: 16, color: 'black', ...inputAndroidStyle },
              inputIOS: { fontSize: 16, paddingVertical: 3, ...inputIOSStyle },
              inputAndroidContainer: styles.inputContainer,
              inputIOSContainer: styles.inputContainer,
            }}
            onValueChange={onValueChange}
          />
        </View>
      </View>
      <View style={[styles.bottomBorder, bottomBorderStyle]} />
    </View>
  );
};

const makeStyles = (hasIcon: boolean) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    container: {
      marginVertical: 11,
    },
    iconStyle: {
      position: 'absolute',
      color: '#c7c5c5',
      marginVertical: 0,
    },
    inputContainer: {
      padding: 0,
      paddingLeft: hasIcon ? 30 : 0,
    },
    labelStyle: {
      paddingLeft: hasIcon ? 30 : 0,
      fontSize: 12,
      fontWeight: 'bold',
      color: '#c7c5c5',
    },
    bottomBorder: {
      borderBottomWidth: 2,
      borderBottomColor: '#c7c5c5',
      marginTop: 3,
    },

    inputIconWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default SelectInput;
