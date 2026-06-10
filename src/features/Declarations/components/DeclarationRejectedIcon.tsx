import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleXmark} from '@fortawesome/pro-solid-svg-icons';
import useTheme from '@src/hooks/useTheme';

const DeclarationRejectedIcon = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    rejectedIconContainer: {
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
    <View style={styles.rejectedIconContainer}>
      <FontAwesomeIcon
        icon={faCircleXmark}
        size={80}
        color={theme.colors.primary}
      />
    </View>
  );
};

export default DeclarationRejectedIcon;
