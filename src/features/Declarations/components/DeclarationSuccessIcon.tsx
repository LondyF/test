import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleCheck} from '@fortawesome/pro-solid-svg-icons';
import useTheme from '@src/hooks/useTheme';

const DeclarationSuccessIcon = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    successIconContainer: {
      width: 110,
      height: 110,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      position: 'absolute',
      borderRadius: 55,
      top: -55,
      alignSelf: 'center',
    },
  });

  return (
    <View style={styles.successIconContainer}>
      <FontAwesomeIcon
        icon={faCircleCheck}
        size={80}
        color={theme.colors.primary}
      />
    </View>
  );
};

export default DeclarationSuccessIcon;
