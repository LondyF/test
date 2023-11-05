import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';

import {faPlus, faQrcode} from '@fortawesome/pro-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

interface GenerateQRButtonProps {
  onPress: () => void;
}

const GenerateQRButton: React.FC<GenerateQRButtonProps> = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <FontAwesomeIcon size={35} icon={faQrcode} />
      <View style={styles.plusIconWrapper}>
        <FontAwesomeIcon color="white" size={12.5} icon={faPlus} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  plusIconWrapper: {
    position: 'absolute',
    right: -6,
    top: -8,
    backgroundColor: '#04E048',
    padding: 5,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default GenerateQRButton;
