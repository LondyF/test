import {IconDefinition} from '@fortawesome/pro-solid-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeIconStyle,
} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import RNPickerSelect, {PickerSelectProps} from 'react-native-picker-select';
import Typography from './typography';

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
  error?: string;
  loading?: boolean;
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
  error,
  loading = false,
  style,
  ...props
}) => {
  const styles = makeStyles(icon !== undefined);

  const isErrored = error && error?.length > 0;

  const Icon = loading ? (
    <ActivityIndicator
      style={[styles.iconStyle, iconStyle]}
      size="small"
      color="#c7c5c5"
    />
  ) : icon ? (
    <FontAwesomeIcon
      style={[styles.iconStyle, iconStyle]}
      size={16}
      icon={icon}
    />
  ) : null;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.labelStyle, labelStyle]}>{label}</Text>
      <View style={styles.inputIconWrapper}>
        {Icon}
        <View style={styles.flex}>
          <RNPickerSelect
            {...props}
            disabled={loading || props.disabled}
            value={value}
            itemKey={itemKey}
            useNativeAndroidPickerStyle={false}
            style={{
              inputAndroid: {
                padding: 0,
                fontSize: 16,
                color: 'black',
                ...inputAndroidStyle,
              },
              inputIOS: {fontSize: 16, paddingVertical: 3, ...inputIOSStyle},
              inputAndroidContainer: styles.inputContainer,
              inputIOSContainer: styles.inputContainer,
              ...style,
            }}
            onValueChange={onValueChange}
          />
        </View>
      </View>
      <View
        style={[
          styles.bottomBorder,
          bottomBorderStyle,
          isErrored ? styles.errorBorderBottom : {},
        ]}
      />
      {isErrored && (
        <Typography variant="b1" text={error} textStyle={styles.errorText} />
      )}
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
    errorBorderBottom: {
      borderBottomColor: '#d50000',
    },
    inputIconWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    errorText: {
      color: '#d50000',
      marginTop: 5,
    },
  });

export default SelectInput;
