import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faFileInvoiceDollar} from '@fortawesome/pro-solid-svg-icons';

const DeclarationImageButton = ({onPress}: {onPress: () => void}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <FontAwesomeIcon icon={faFileInvoiceDollar} size={20} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: 'rgba(120,50,31, .4)', // IOS
    shadowOffset: {height: 2, width: 2}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
  },
});

export default DeclarationImageButton;
